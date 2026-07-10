import localforage from 'localforage';

// Three separate IndexedDB stores, kept distinct on purpose:
// - auth: small, security-sensitive, cleared on logout
// - syncQueue: the offline queue itself — every record a field officer has
//   ever submitted locally, until the server confirms it (see syncEngine.js)
// - referenceData: a read-only local cache of beneficiaries/groups, pulled
//   from the server whenever online, so forms that reference a beneficiary
//   or group can still be filled out with zero connectivity.

export const authStore = localforage.createInstance({ name: 'nexode-field', storeName: 'auth' });
export const syncQueue = localforage.createInstance({ name: 'nexode-field', storeName: 'sync_queue' });
export const referenceData = localforage.createInstance({ name: 'nexode-field', storeName: 'reference_data' });

// ---- Sync queue helpers ----
// Each queued item: { client_record_id, module, payload, device_captured_at,
//                      sync_status: 'pending'|'syncing'|'synced'|'error',
//                      attempt_count, last_error, queued_at }

export async function enqueueRecord(item) {
  await syncQueue.setItem(item.client_record_id, item);
}

export async function updateQueuedRecord(clientRecordId, patch) {
  const existing = await syncQueue.getItem(clientRecordId);
  if (!existing) return;
  await syncQueue.setItem(clientRecordId, { ...existing, ...patch });
}

export async function removeQueuedRecord(clientRecordId) {
  await syncQueue.removeItem(clientRecordId);
}

export async function getAllQueuedRecords() {
  const items = [];
  await syncQueue.iterate((value) => { items.push(value); });
  // Oldest device_captured_at first — matches the architecture spec's
  // "sequential streaming, oldest first" rule.
  return items.sort((a, b) => new Date(a.device_captured_at) - new Date(b.device_captured_at));
}

export async function getQueueCounts() {
  const items = await getAllQueuedRecords();
  return {
    pending: items.filter((i) => i.sync_status === 'pending').length,
    error: items.filter((i) => i.sync_status === 'error').length,
    total: items.length,
  };
}

// ---- Reference data helpers ----

export async function setReferenceData(key, records) {
  await referenceData.setItem(key, { records, cachedAt: new Date().toISOString() });
}

export async function getReferenceData(key) {
  const entry = await referenceData.getItem(key);
  return entry ? entry.records : [];
}
