import { useEffect, useState } from 'react';
import { getReferenceData } from '../db';

export default function BeneficiaryPicker({ value, onChange }) {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getReferenceData('beneficiaries').then(setBeneficiaries);
  }, []);

  const filtered = beneficiaries.filter((b) =>
    `${b.full_name} ${b.beneficiary_code}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        className="picker-search"
        placeholder="Search by name or code…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="picker-list">
        {filtered.length === 0 && (
          <div className="picker-option" style={{ color: 'var(--text-muted)' }}>
            {beneficiaries.length === 0
              ? 'No beneficiaries cached yet — open Sync Status and refresh reference data while online.'
              : 'No matches.'}
          </div>
        )}
        {filtered.map((b) => (
          <div
            key={b.id}
            className={`picker-option${value === b.id ? ' selected' : ''}`}
            onClick={() => onChange(b.id)}
          >
            {b.full_name} — {b.beneficiary_code}
          </div>
        ))}
      </div>
    </div>
  );
}
