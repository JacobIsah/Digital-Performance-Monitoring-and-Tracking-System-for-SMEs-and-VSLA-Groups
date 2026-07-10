import { checkConnectivity, ingestRecord } from './api';
import { getAllQueuedRecords, updateQueuedRecord, removeQueuedRecord } from './db';
import { SYNC_POLL_INTERVAL_MS } from './config';

// Simple pub-sub so any page (the Sync Status screen, a header badge, etc.)
// can react to queue changes without prop-drilling a sync engine instance
// through the whole app.
const listeners = new Set();
export function onSyncTick(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function notify() {
  listeners.forEach((cb) => cb());
}

let isSyncing = false;

/**
 * Drains the queue sequentially, oldest record first — matches the
 * architecture spec: one POST per record, so a single malformed record
 * doesn't block everything behind it, and progress is granular
 * ("14 of 32 synced") rather than all-or-nothing.
 */
export async function processQueue() {
  if (isSyncing) return; // avoid overlapping runs from the poll timer + online event + manual button
  isSyncing = true;
  try {
    const online = await checkConnectivity();
    if (!online) return;

    const records = await getAllQueuedRecords();
    for (const record of records) {
      if (record.sync_status === 'error') continue; // needs manual review, not auto-retried
      await updateQueuedRecord(record.client_record_id, { sync_status: 'syncing' });
      notify();

      try {
        const result = await ingestRecord({
          module: record.module,
          client_record_id: record.client_record_id,
          device_captured_at: record.device_captured_at,
          payload: record.payload,
        });

        if (result.status === 'created' || result.status === 'duplicate') {
          await removeQueuedRecord(record.client_record_id);
        } else {
          // Validation error (4xx) — surface it, don't blindly retry.
          await updateQueuedRecord(record.client_record_id, {
            sync_status: 'error',
            last_error: result.errors || result,
          });
        }
      } catch (networkErr) {
        // Genuine network failure mid-batch — stop this pass entirely and
        // let it retry on the next poll/online event rather than hammering
        // a connection that just dropped.
        await updateQueuedRecord(record.client_record_id, {
          sync_status: 'pending',
          attempt_count: (record.attempt_count || 0) + 1,
          last_error: networkErr.message,
        });
        notify();
        return;
      }
      notify();
    }
  } finally {
    isSyncing = false;
    notify();
  }
}

let pollHandle = null;

export function startSyncEngine() {
  if (pollHandle) return;
  processQueue();
  window.addEventListener('online', processQueue);
  pollHandle = setInterval(processQueue, SYNC_POLL_INTERVAL_MS);
}

export function stopSyncEngine() {
  window.removeEventListener('online', processQueue);
  if (pollHandle) clearInterval(pollHandle);
  pollHandle = null;
}
