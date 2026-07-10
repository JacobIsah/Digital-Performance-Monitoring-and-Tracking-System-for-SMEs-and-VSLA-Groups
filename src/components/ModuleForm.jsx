import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BeneficiaryPicker from './BeneficiaryPicker';
import GroupPicker from './GroupPicker';
import { enqueueRecord } from '../db';
import { processQueue } from '../syncEngine';

const emptyValueFor = (type) => (type === 'checkbox' ? false : '');

export default function ModuleForm({ schema }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(schema.fields.map((f) => [f.name, emptyValueFor(f.type)]))
  );
  const [gps, setGps] = useState(null);
  const [gpsCapturing, setGpsCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  function captureGps() {
    if (!navigator.geolocation) {
      setFeedback({ type: 'error', message: 'GPS is not available on this device.' });
      return;
    }
    setGpsCapturing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsCapturing(false);
      },
      () => {
        setFeedback({ type: 'error', message: 'Could not get GPS location. Try again outdoors.' });
        setGpsCapturing(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  function validate() {
    for (const f of schema.fields) {
      if (f.required && f.type !== 'gps' && !values[f.name]) {
        return `"${f.label}" is required.`;
      }
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setFeedback({ type: 'error', message: error });
      return;
    }

    setSubmitting(true);
    const payload = {};
    schema.fields.forEach((f) => {
      if (f.type === 'gps') return; // handled below
      if (f.type === 'checkbox') { payload[f.name] = Boolean(values[f.name]); return; }
      if (values[f.name] !== '') payload[f.name] = values[f.name];
    });
    if (schema.fields.some((f) => f.type === 'gps') && gps) {
      payload.gps_latitude = gps.lat;
      payload.gps_longitude = gps.lng;
    }

    const record = {
      client_record_id: uuidv4(),
      module: schema.moduleKey,
      device_captured_at: new Date().toISOString(),
      payload,
      sync_status: 'pending',
      attempt_count: 0,
      queued_at: new Date().toISOString(),
    };

    await enqueueRecord(record);
    setSubmitting(false);
    setFeedback({ type: 'success', message: 'Saved. It will sync automatically once online.' });
    setValues(Object.fromEntries(schema.fields.map((f) => [f.name, emptyValueFor(f.type)])));
    setGps(null);

    // Fire-and-forget — don't block the officer's next entry on network status.
    processQueue();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="form-title">{schema.title}</h1>

      {schema.fields.map((f) => (
        <div className="field" key={f.name}>
          <label>{f.label}{f.required ? ' *' : ''}</label>

          {f.type === 'text' && (
            <input type="text" value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)} />
          )}
          {f.type === 'number' && (
            <input type="number" value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)} />
          )}
          {f.type === 'date' && (
            <input type="date" value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)} />
          )}
          {f.type === 'textarea' && (
            <textarea value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)} />
          )}
          {f.type === 'select' && (
            <select value={values[f.name]} onChange={(e) => setField(f.name, e.target.value)}>
              <option value="">Select…</option>
              {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          )}
          {f.type === 'checkbox' && (
            <div className="field-checkbox">
              <input
                type="checkbox"
                checked={Boolean(values[f.name])}
                onChange={(e) => setField(f.name, e.target.checked)}
              />
              <span>Yes</span>
            </div>
          )}
          {f.type === 'beneficiary_picker' && (
            <BeneficiaryPicker value={values[f.name]} onChange={(id) => setField(f.name, id)} />
          )}
          {f.type === 'group_picker' && (
            <GroupPicker value={values[f.name]} onChange={(id) => setField(f.name, id)} />
          )}
          {f.type === 'gps' && (
            <div className="gps-row">
              <button type="button" className="gps-button" onClick={captureGps} disabled={gpsCapturing}>
                {gpsCapturing ? 'Capturing…' : gps ? 'Recapture GPS' : 'Capture GPS'}
              </button>
              {gps && <span className="gps-captured">{gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}</span>}
            </div>
          )}
        </div>
      ))}

      <button type="submit" className="submit-button" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save Entry'}
      </button>

      {feedback && (
        <div className={`form-feedback ${feedback.type}`}>{feedback.message}</div>
      )}
    </form>
  );
}
