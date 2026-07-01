import React, { useState, useCallback, useEffect } from 'react';
import AuthPage    from './pages/AuthPage';
import RecruteurApp from './pages/RecruteurApp';
import CandidatApp  from './pages/CandidatApp';
import AdminApp     from './pages/AdminApp';
import AdminLoginPage from './pages/AdminLoginPage';

const ADMIN_PATH = '/nexttalent-admin';

export default function App() {
  const [session, setSession] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Détecter si on est sur /nexttalent-admin
    setIsAdminRoute(window.location.pathname.startsWith(ADMIN_PATH));
  }, []);

  const handleLogin  = useCallback((userData) => setSession(userData), []);
  const handleLogout = useCallback(() => {
    setSession(null);
    if (isAdminRoute) window.location.href = '/';
  }, [isAdminRoute]);

  // Route admin séparée
  if (isAdminRoute) {
    if (!session || session.role !== 'admin') {
      return <AdminLoginPage onLogin={handleLogin} />;
    }
    return <AdminApp session={session} onLogout={handleLogout} />;
  }

  // Route normale
  if (!session) return <AuthPage onLogin={handleLogin} />;
  if (session.role === 'recruteur') return <RecruteurApp session={session} onLogout={handleLogout} />;
  return <CandidatApp session={session} onLogout={handleLogout} />;
}
