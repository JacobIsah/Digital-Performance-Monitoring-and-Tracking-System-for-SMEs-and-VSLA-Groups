import { Link } from 'react-router-dom';
import { MODULE_SCHEMAS } from '../schemas';

export default function Home() {
  return (
    <div>
      <h1 className="form-title">New Entry</h1>
      <div className="module-grid">
        {MODULE_SCHEMAS.map((s) => (
          <Link key={s.moduleKey} to={`/form/${s.moduleKey}`} className="module-card">
            <div>
              <div className="module-card-title">{s.title}</div>
              <div className="module-card-sub">{s.fields.length} fields</div>
            </div>
            <div className="module-card-arrow">›</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
