import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getQueueCounts } from '../db';
import { onSyncTick } from '../syncEngine';

export default function BottomNav() {
  const [needsAttention, setNeedsAttention] = useState(0);

  useEffect(() => {
    async function refresh() {
      const counts = await getQueueCounts();
      setNeedsAttention(counts.error);
    }
    refresh();
    return onSyncTick(refresh);
  }, []);

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <span>🏠</span>
        <span>New Entry</span>
      </NavLink>
      <NavLink to="/sync" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span>🔄</span>
        <span>Sync Status{needsAttention > 0 && <span className="nav-badge">{needsAttention}</span>}</span>
      </NavLink>
    </nav>
  );
}
