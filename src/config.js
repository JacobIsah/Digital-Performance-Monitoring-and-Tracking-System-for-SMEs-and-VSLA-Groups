// Set VITE_API_BASE_URL in Amplify's environment variables to your
// Elastic Beanstalk URL, e.g. http://nexode-backend-env.eba-xxxxx.us-east-1.elasticbeanstalk.com/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// How often (ms) the sync engine checks connectivity + tries to drain the
// queue when the app is open, on top of the immediate attempt after every
// new record and the browser's 'online' event.
export const SYNC_POLL_INTERVAL_MS = 30000;
