import React, { useState, useCallback, useEffect } from 'react';
import AuthPage     from './pages/AuthPage';
import RecruteurApp from './pages/RecruteurApp';
import CandidatApp  from './pages/CandidatApp';
import AdminApp     from './pages/AdminApp';
import AdminLoginPage from './pages/AdminLoginPage';
import LandingPage  from './pages/LandingPage';

const ADMIN_PATH = '/nexttalent-admin';

export default function App() {
  const [session,      setSession]      = useState(null);
  const [showLanding,  setShowLanding]  = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(window.location.pathname.startsWith(ADMIN_PATH));
    // Si on arrive directement sur /verify-email, passer la landing
    if (window.location.pathname === '/verify-email') {
      setShowLanding(false);
    }
  }, []);

  const handleLogin  = useCallback((userData) => setSession(userData), []);
  const handleLogout = useCallback(() => {
    setSession(null);
    setShowLanding(true);
    if (isAdminRoute) window.location.href = '/';
  }, [isAdminRoute]);

  // Route admin séparée
  if (isAdminRoute) {
    if (!session || session.role !== 'admin') return <AdminLoginPage onLogin={handleLogin} />;
    return <AdminApp session={session} onLogout={handleLogout} />;
  }

  // Landing page
  if (showLanding && !session) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  // Auth
  if (!session) return <AuthPage onLogin={handleLogin} />;

  // App
  if (session.role === 'recruteur') return <RecruteurApp session={session} onLogout={handleLogout} />;
  return <CandidatApp session={session} onLogout={handleLogout} />;
}
