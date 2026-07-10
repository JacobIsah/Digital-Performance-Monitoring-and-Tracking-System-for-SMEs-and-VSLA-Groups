# Deployment Guide — Field PWA on Amplify Hosting

## 1. Point it at your backend

Before deploying, the PWA needs to know your Elastic Beanstalk API URL.
Two ways to set it:

- **Local testing**: copy `.env.example` to `.env` and fill in
  `VITE_API_BASE_URL=http://<your-eb-url>/api/v1`
- **Amplify (production)**: set it as an environment variable in the Amplify
  Console instead (see Step 4) — don't commit real URLs to `.env`.

## 2. CORS on the backend

Your Django backend currently allows all origins (`CORS_ALLOW_ALL_ORIGINS=True`
from the earlier setup), so this will work immediately. Once you know your
Amplify domain, tighten that in the backend's environment variables to just
that domain for better security.

## 3. Push to GitHub

Amplify deploys from a git repo, same as the dashboard project earlier.

```bash
cd nexode-pwa
git init
git add .
git commit -m "Initial PWA"
# push to a new GitHub repo
```

## 4. Connect Amplify Hosting

1. AWS Console → **Amplify** → **New app** → **Host web app** → connect the repo → select the branch.
2. Amplify auto-detects `amplify.yml`.
3. **App settings → Environment variables** → add:
   - `VITE_API_BASE_URL` = `http://<your-eb-url>/api/v1`
4. Deploy. You'll get a URL like `https://main.dxxxxx.amplifyapp.com`.

## 5. Install it on a field officer's phone

Open the Amplify URL in Chrome (Android) or Safari (iOS):
- **Android/Chrome**: a banner or menu option "Add to Home Screen" installs it as a standalone app icon.
- **iOS/Safari**: Share button → "Add to Home Screen".

Once installed, it opens full-screen like a native app and works with zero
connectivity for both filling forms and reviewing the sync queue — only
actual syncing needs a connection.

## 6. Create field officer logins

Each field officer needs a login created the same way you created the admin
account earlier — either through Django admin (`/admin/`) or by adding a
management command. There's no self-signup in this app by design; accounts
are provisioned by an admin.

## 7. Before first use in the field

Have each field officer, while still on office wifi:
1. Log in.
2. Go to **Sync Status → Refresh Reference Data** — this downloads the
   current beneficiary and group lists so the pickers work offline.

Without this step, the beneficiary/group pickers in the enterprise-module
forms will be empty until the officer is back online.

## What this doesn't do yet

- **No photo capture.** The spec's beneficiary photo and mentoring-visit
  photos aren't wired up — `beneficiary_photo_url` / `photo_paths` exist on
  the backend but this PWA doesn't yet have a camera/file input queuing
  binary uploads offline. Worth a dedicated follow-up since offline photo
  queueing (compressing, storing as blobs in IndexedDB, uploading
  multipart on sync) is a meaningfully different problem than the text-field
  queueing built here.
- **No background sync API integration.** Syncing happens when the app is
  open (on load, every 30s, on the browser's `online` event, and via the
  manual "Sync Now" button) — not via the Web Background Sync API, which
  has inconsistent browser support (notably absent in Safari/iOS). This is
  the same tradeoff the architecture spec anticipated with its "manual Sync
  Now fallback."
- **No `/groups/` list endpoint on the backend yet**, so the group picker
  derives its list from VSLA Performance records as a workaround (see the
  comment in `src/api.js`). Worth adding a real endpoint if groups need to
  be creatable/browsable independent of a VSLA Performance submission.
