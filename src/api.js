import { API_BASE_URL } from './config';
import { authStore } from './db';

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid username or password.');
  const data = await res.json();
  await authStore.setItem('access', data.access);
  await authStore.setItem('refresh', data.refresh);
  await authStore.setItem('full_name', data.full_name);
  await authStore.setItem('role', data.role);
  await authStore.setItem('username', username);
  return data;
}

export async function logout() {
  await authStore.clear();
}

export async function isLoggedIn() {
  return Boolean(await authStore.getItem('access'));
}

export async function getCurrentUser() {
  return {
    fullName: await authStore.getItem('full_name'),
    role: await authStore.getItem('role'),
    username: await authStore.getItem('username'),
  };
}

async function refreshAccessToken() {
  const refresh = await authStore.getItem('refresh');
  if (!refresh) throw new Error('No refresh token — please log in again.');
  const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) throw new Error('Session expired — please log in again.');
  const data = await res.json();
  await authStore.setItem('access', data.access);
  return data.access;
}

// Wraps fetch with the auth header, and retries exactly once after a
// silent token refresh on a 401 — field officers shouldn't get logged out
// mid-shift just because a 12-hour access token happened to expire between
// form submissions.
async function authedFetch(path, options = {}) {
  let access = await authStore.getItem('access');
  const doFetch = (token) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

  let res = await doFetch(access);
  if (res.status === 401) {
    access = await refreshAccessToken();
    res = await doFetch(access);
  }
  return res;
}

export async function checkConnectivity() {
  try {
    const res = await fetch(`${API_BASE_URL}/ping/`, { method: 'GET', cache: 'no-store' });
    return res.status === 204;
  } catch {
    return false;
  }
}

// Single-record ingestion — matches the architecture spec's "sequential
// streaming, one POST per record" design. Returns the parsed response body
// regardless of status code, so the sync engine can inspect
// result.status ('created' | 'duplicate' | 'error') itself.
export async function ingestRecord(record) {
  const res = await authedFetch('/sync/ingest/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
  const body = await res.json().catch(() => ({}));
  return { httpStatus: res.status, ...body };
}

export async function fetchAllPages(path) {
  let url = path;
  let results = [];
  while (url) {
    const res = await authedFetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    results = results.concat(data.results || []);
    // DRF pagination gives a full URL in `next` — strip the base since
    // authedFetch prepends it.
    url = data.next ? data.next.replace(API_BASE_URL, '') : null;
  }
  return results;
}

export async function fetchBeneficiaries() {
  return fetchAllPages('/beneficiaries/?page_size=500');
}

export async function fetchGroups() {
  // Groups aren't behind a dedicated list endpoint in the backend yet, so
  // this derives the set from VSLA Performance records as a fallback.
  // Point this at a real /api/v1/groups/ endpoint once one exists server-side.
  const rows = await fetchAllPages('/vsla-performance/?page_size=500');
  const seen = new Map();
  rows.forEach((r) => {
    if (r.group && !seen.has(r.group)) seen.set(r.group, { id: r.group });
  });
  return Array.from(seen.values());
}
