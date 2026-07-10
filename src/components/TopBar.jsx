import { useEffect, useState } from 'react';
import { checkConnectivity } from '../api';
import { getQueueCounts } from '../db';
import { onSyncTick } from '../syncEngine';

export default function TopBar() {
  const [online, setOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function refresh() {
      const [isOnline, counts] = await Promise.all([checkConnectivity(), getQueueCounts()]);
      if (mounted) {
        setOnline(isOnline);
        setPendingCount(counts.pending + counts.error);
      }
    }
    refresh();
    const unsubscribe = onSyncTick(refresh);
    const interval = setInterval(refresh, 15000);
    return () => { mounted = false; unsubscribe(); clearInterval(interval); };
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-title">AgroAid <span>Farms and Services</span></div>
      <div className="topbar-status">
        {pendingCount > 0 && <span className="topbar-badge">{pendingCount} queued</span>}
        <span className={`status-dot ${online ? 'online' : 'offline'}`} />
        {online ? 'Online' : 'Offline'}
      </div>
    </div>
  );
}
