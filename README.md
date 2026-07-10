# NEXODE Field Monitor — Field Officer PWA

Offline-first data collection app for all 9 modules, syncing to the Django
backend built earlier. Installs to a phone's home screen and works with zero
connectivity for form entry; syncing happens whenever a connection is available.

## How it matches the architecture spec

- **Service Worker** (`vite-plugin-pwa`) precaches the app shell (JS/CSS/HTML)
  so the app opens offline.
- **IndexedDB** (via `localforage`, see `src/db.js`) queues every submission
  locally with a client-generated `client_record_id`, the device's own
  `device_captured_at` timestamp, and a `sync_status`.
- **Sequential streaming sync** (`src/syncEngine.js`) drains the queue oldest-
  first, one `POST /sync/ingest/` per record — a single malformed record
  doesn't block the rest, matching the spec's design.
- **Connectivity detection** uses a real `GET /ping/` call, not just
  `navigator.onLine`, since that alone is unreliable (e.g. behind a captive
  portal) — same reasoning as in the technical spec.
- **Manual "Sync Now" fallback** plus automatic triggers (on load, every 30s,
  on the browser's `online` event) — no dependency on the Web Background
  Sync API, which isn't supported in Safari/iOS.

## All 9 modules

Beneficiary Registration, VSLA Performance, Liquid Soap SME, Goat Enterprise,
Vegetable Enterprise, Red Oil Enterprise, Cocoa Farmer, Mentoring & Technical
Support, Household Assessment — each defined as a field schema in
`src/schemas/`, rendered by one generic `ModuleForm` component. Field names
match the backend serializers exactly.

## Structure

```
src/
  config.js           API base URL, sync poll interval
  db.js               IndexedDB stores: auth, sync queue, reference data cache
  api.js              Login, token refresh, ping, sync ingestion, reference data fetch
  syncEngine.js        Queue draining logic, connectivity checks, retry handling
  schemas/             One file per module (field definitions) + registry
  components/          ModuleForm (generic renderer), BeneficiaryPicker, GroupPicker, TopBar, BottomNav
  pages/                Login, Home (module list), ModuleFormPage, SyncStatus
DEPLOYMENT_GUIDE.md    Start here
```

## Local development

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your local or deployed backend
npm run dev
```

## Deploying

See `DEPLOYMENT_GUIDE.md` — Amplify Hosting, same pattern as the dashboard.
