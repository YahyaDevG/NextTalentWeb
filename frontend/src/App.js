import React, { useState, useCallback } from 'react';
import AuthPage    from './pages/AuthPage';
import RecruteurApp from './pages/RecruteurApp';
import CandidatApp  from './pages/CandidatApp';

export default function App() {
  const [session, setSession] = useState(null); // { user_id, nom, email, role }

  const handleLogin  = useCallback((userData) => setSession(userData), []);
  const handleLogout = useCallback(() => setSession(null), []);

  if (!session) return <AuthPage onLogin={handleLogin} />;
  if (session.role === 'recruteur') return <RecruteurApp session={session} onLogout={handleLogout} />;
  return <CandidatApp session={session} onLogout={handleLogout} />;
}
