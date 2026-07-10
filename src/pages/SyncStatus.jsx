import { useEffect, useState, useCallback } from 'react';
import { getAllQueuedRecords, getQueueCounts, setReferenceData, updateQueuedRecord, removeQueuedRecord } from '../db';
import { processQueue, onSyncTick } from '../syncEngine';
import { fetchBeneficiaries, fetchGroups, checkConnectivity } from '../api';
import { SCHEMA_BY_KEY } from '../schemas';

export default function SyncStatus() {
  const [counts, setCounts] = useState({ pending: 0, error: 0, total: 0 });
  const [items, setItems] = useState([]);
  const [refreshingRef, setRefreshingRef] = useState(false);
  const [refMessage, setRefMessage] = useState('');
  const [online, setOnline] = useState(null);

  const refresh = useCallback(async () => {
    setCounts(await getQueueCounts());
    setItems(await getAllQueuedRecords());
  }, []);

  useEffect(() => {
    refresh();
    const unsubscribe = onSyncTick(refresh);
    checkConnectivity().then(setOnline);
    return unsubscribe;
  }, [refresh]);

  async function handleRefreshReferenceData() {
    setRefreshingRef(true);
    setRefMessage('');
    try {
      const [beneficiaries, groups] = await Promise.all([fetchBeneficiaries(), fetchGroups()]);
      await setReferenceData('beneficiaries', beneficiaries);
      await setReferenceData('groups', groups);
      setRefMessage(`Cached ${beneficiaries.length} beneficiaries and ${groups.length} groups for offline use.`);
    } catch (err) {
      setRefMessage(`Could not refresh — ${err.message}. You need to be online for this step.`);
    } finally {
      setRefreshingRef(false);
    }
  }

  async function retryErrored(clientRecordId) {
    await updateQueuedRecord(clientRecordId, { sync_status: 'pending' });
    processQueue();
  }

  async function discard(clientRecordId) {
    await removeQueuedRecord(clientRecordId);
    refresh();
  }

  return (
    <div>
      <h1 className="form-title">Sync Status</h1>

      <div className="sync-summary">
        <div className="sync-stat">
          <div className="sync-stat-value">{counts.pending}</div>
          <div className="sync-stat-label">Pending</div>
        </div>
        <div className="sync-stat">
          <div className="sync-stat-value" style={{ color: 'var(--coral)' }}>{counts.error}</div>
          <div className="sync-stat-label">Needs Review</div>
        </div>
        <div className="sync-stat">
          <div className="sync-stat-value">{online === null ? '…' : online ? 'Online' : 'Offline'}</div>
          <div className="sync-stat-label">Connection</div>
        </div>
      </div>

      <button className="sync-now-button" onClick={() => processQueue()}>
        Sync Now
      </button>

      <div className="field">
        <label>Offline reference data (beneficiaries &amp; groups)</label>
        <button type="button" className="gps-button" onClick={handleRefreshReferenceData} disabled={refreshingRef}>
          {refreshingRef ? 'Refreshing…' : 'Refresh Reference Data'}
        </button>
        {refMessage && <div className="field-hint">{refMessage}</div>}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">Nothing queued — everything's synced.</div>
      ) : (
        items.map((item) => (
          <div className="queue-item" key={item.client_record_id}>
            <div className="queue-item-top">
              <span className="queue-item-module">
                {SCHEMA_BY_KEY[item.module]?.title || item.module}
              </span>
              <span className={`queue-status-chip ${item.sync_status}`}>{item.sync_status}</span>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Captured {new Date(item.device_captured_at).toLocaleString()}
            </div>
            {item.sync_status === 'error' && (
              <>
                <div style={{ color: 'var(--coral)', marginTop: 6 }}>
                  {typeof item.last_error === 'string' ? item.last_error : JSON.stringify(item.last_error)}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="button" className="gps-button" onClick={() => retryErrored(item.client_record_id)}>
                    Retry
                  </button>
                  <button type="button" className="gps-button" onClick={() => discard(item.client_record_id)}>
                    Discard
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
