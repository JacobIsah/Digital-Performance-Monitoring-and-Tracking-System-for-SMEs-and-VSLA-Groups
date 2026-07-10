// Set VITE_API_BASE_URL in Amplify's environment variables. The Amplify app
// is served over HTTPS, so this must be an HTTPS URL too (browsers block
// HTTPS pages from calling HTTP APIs as "mixed content"). The Elastic
// Beanstalk single-instance environment only speaks HTTP, so point this at
// a CloudFront distribution proxying the EB origin instead of the EB URL
// directly, e.g. https://dxxxxxxxxxxxxx.cloudfront.net/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// How often (ms) the sync engine checks connectivity + tries to drain the
// queue when the app is open, on top of the immediate attempt after every
// new record and the browser's 'online' event.
export const SYNC_POLL_INTERVAL_MS = 30000;
