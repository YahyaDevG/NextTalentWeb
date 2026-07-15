import React, { useState, useCallback, useEffect } from 'react';
import AuthPage          from './pages/AuthPage';
import RecruteurApp      from './pages/RecruteurApp';
import CandidatApp       from './pages/CandidatApp';
import AdminApp          from './pages/AdminApp';
import AdminLoginPage    from './pages/AdminLoginPage';
import LandingPage       from './pages/LandingPage';
import RecruteurPage     from './pages/RecruteurPage';
import CandidatPage      from './pages/CandidatPage';
import FonctionnalitesPage from './pages/FonctionnalitesPage';

const ADMIN_PATH = '/nexttalent-admin';

// Pages publiques : 'landing' | 'recruteur-info' | 'candidat-info' | 'fonctionnalites' | 'auth'
export default function App() {
  const [session,    setSession]    = useState(null);
  const [page,       setPage]       = useState('landing');
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(window.location.pathname.startsWith(ADMIN_PATH));
    if (window.location.pathname === '/verify-email') setPage('auth');
  }, []);

  const handleLogin  = useCallback((u) => setSession(u), []);
  const handleLogout = useCallback(() => {
    setSession(null);
    setPage('landing');
    if (isAdminRoute) window.location.href = '/';
  }, [isAdminRoute]);

  // ── Admin route ─────────────────────────────────────────────────────────
  if (isAdminRoute) {
    if (!session || session.role !== 'admin') return <AdminLoginPage onLogin={handleLogin} />;
    return <AdminApp session={session} onLogout={handleLogout} />;
  }

  // ── Authenticated ────────────────────────────────────────────────────────
  if (session) {
    if (session.role === 'recruteur') return <RecruteurApp session={session} onLogout={handleLogout} />;
    return <CandidatApp session={session} onLogout={handleLogout} />;
  }

  // ── Public pages ─────────────────────────────────────────────────────────
  const goRegister = () => setPage('auth');
  const goLanding  = () => setPage('landing');

  if (page === 'recruteur-info')
    return <RecruteurPage     onBack={goLanding} onRegister={goRegister} />;
  if (page === 'candidat-info')
    return <CandidatPage      onBack={goLanding} onRegister={goRegister} />;
  if (page === 'fonctionnalites')
    return <FonctionnalitesPage onBack={goLanding} onRegister={goRegister} />;
  if (page === 'auth')
    return <AuthPage onLogin={handleLogin} onBack={goLanding} />;

  return (
    <LandingPage
      onEnter={() => setPage('auth')}
      onRecruteur={() => setPage('recruteur-info')}
      onCandidat={() => setPage('candidat-info')}
      onFonctionnalites={() => setPage('fonctionnalites')}
    />
  );
}
