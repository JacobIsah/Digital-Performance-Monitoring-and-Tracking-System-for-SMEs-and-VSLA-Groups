import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn, logout, getCurrentUser } from './api';
import { startSyncEngine, stopSyncEngine } from './syncEngine';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import ModuleFormPage from './pages/ModuleFormPage';
import SyncStatus from './pages/SyncStatus';

export default function App() {
  const [authState, setAuthState] = useState('checking'); // checking | in | out
  const [user, setUser] = useState(null);

  async function checkAuth() {
    const loggedIn = await isLoggedIn();
    if (loggedIn) {
      setUser(await getCurrentUser());
      setAuthState('in');
    } else {
      setAuthState('out');
    }
  }

  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    if (authState === 'in') {
      startSyncEngine();
      return () => stopSyncEngine();
    }
  }, [authState]);

  async function handleLogout() {
    await logout();
    stopSyncEngine();
    setAuthState('out');
  }

  if (authState === 'checking') return <div className="empty-state">Loading…</div>;

  return (
    <BrowserRouter>
      {authState === 'out' ? (
        <Routes>
          <Route path="*" element={<Login onLoggedIn={checkAuth} />} />
        </Routes>
      ) : (
        <div className="app-shell">
          <TopBar />
          <div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/form/:moduleKey" element={<ModuleFormPage />} />
              <Route path="/sync" element={<SyncStatus />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {user && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <button type="button" className="gps-button" onClick={handleLogout}>
                  Sign out ({user.fullName || user.username})
                </button>
              </div>
            )}
          </div>
          <BottomNav />
        </div>
      )}
    </BrowserRouter>
  );
}
