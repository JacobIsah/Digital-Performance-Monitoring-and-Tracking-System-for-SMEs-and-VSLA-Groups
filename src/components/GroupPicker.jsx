import { useEffect, useState } from 'react';
import { getReferenceData } from '../db';

export default function GroupPicker({ value, onChange }) {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getReferenceData('groups').then(setGroups);
  }, []);

  const filtered = groups.filter((g) =>
    `${g.group_name || ''} ${g.group_code || g.id}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        className="picker-search"
        placeholder="Search groups…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="picker-list">
        {filtered.length === 0 && (
          <div className="picker-option" style={{ color: 'var(--text-muted)' }}>
            {groups.length === 0
              ? 'No groups cached yet — open Sync Status and refresh reference data while online.'
              : 'No matches.'}
          </div>
        )}
        {filtered.map((g) => (
          <div
            key={g.id}
            className={`picker-option${value === g.id ? ' selected' : ''}`}
            onClick={() => onChange(g.id)}
          >
            {g.group_name || g.group_code || g.id}
          </div>
        ))}
      </div>
    </div>
  );
}
