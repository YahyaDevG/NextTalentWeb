import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Btn, Input, Select, Alert } from '../components/ui';

export default function AuthPage({ onLogin }) {
  const [tab,     setTab]     = useState('login');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  // Login
  const [lEmail, setLEmail] = useState('');
  const [lPass,  setLPass]  = useState('');
  const [lRole,  setLRole]  = useState('recruteur');

  // Register
  const [rNom,   setRNom]   = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPass,  setRPass]  = useState('');
  const [rRole,  setRRole]  = useState('recruteur');

  // Handle /verify-email?token= in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token && window.location.pathname === '/verify-email') {
      // Redirect to backend verify endpoint
      window.location.href = `${process.env.REACT_APP_API_URL || ''}/auth/verify-email?token=${token}`;
    }
  }, []);

  const roleOptions = [
    { value: 'recruteur', label: '🏢 Recruteur (RH)' },
    { value: 'candidat',  label: '👤 Candidat' },
  ];

  async function handleLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await api.login({ email: lEmail, password: lPass, role: lRole });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.register({ nom: rNom, email: rEmail, password: rPass, role: rRole });
      const user = await api.login({ email: rEmail, password: rPass, role: rRole });
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  const tabStyle = (active) => ({
    flex: 1, padding: '11px 0', textAlign: 'center', border: 'none',
    background: 'transparent', cursor: 'pointer', fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--indigo)' : 'var(--text-2)',
    borderBottom: active ? '2px solid var(--indigo)' : '2px solid transparent',
    transition: 'all .15s', marginBottom: -1,
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(140deg, #EEF2FF 0%, #F5F3FF 50%, #F0FDF4 100%)',
    }}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,.08) 0%, transparent 70%)', top: '-10%', left: '-5%' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,.07) 0%, transparent 70%)', bottom: '-5%', right: '-5%' }} />
      </div>

      <div className="anim-pop" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, margin: '0 16px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 12px',
            background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(79,70,229,.3)',
          }}>
            <i className="ti ti-brain" style={{ color: '#fff', fontSize: 26 }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--text)', letterSpacing: '-.02em' }}>NextTalent</h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>Plateforme intelligente de recrutement IA</p>
        </div>

        {/* ── Login / Register ── */}
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
              <button style={tabStyle(tab === 'login')}    onClick={() => { setTab('login');    setError(''); setSuccess(''); }}>Se connecter</button>
              <button style={tabStyle(tab === 'register')} onClick={() => { setTab('register'); setError(''); setSuccess(''); }}>S'inscrire</button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {error   && <div style={{ marginBottom: 14 }}><Alert type="danger">{error}</Alert></div>}
              {success && <div style={{ marginBottom: 14 }}><Alert type="success">{success}</Alert></div>}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Input label="Adresse e-mail" value={lEmail} onChange={setLEmail} type="email" placeholder="vous@exemple.com" required />
                  <Input label="Mot de passe"   value={lPass}  onChange={setLPass}  type="password" placeholder="••••••••" required />
                  <Select label="Votre rôle" value={lRole} onChange={setLRole} options={roleOptions} />
                  <Btn type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
                    <i className="ti ti-login" /> Se connecter
                  </Btn>
                </form>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Input label="Nom complet"    value={rNom}   onChange={setRNom}   placeholder="Prénom Nom" required />
                  <Input label="Adresse e-mail" value={rEmail} onChange={setREmail} type="email" placeholder="vous@exemple.com" required />
                  <Input label="Mot de passe"   value={rPass}  onChange={setRPass}  type="password" placeholder="••••••••" required />
                  <Select label="Votre rôle" value={rRole} onChange={setRRole} options={roleOptions} />
                  <Btn type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
                    <i className="ti ti-user-plus" /> Créer mon compte
                  </Btn>
                </form>
              )}
            </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-3)', marginTop: 16 }}>
          NextTalent v2.0 · Propulsé par LLaMA 3.1 & IA
        </p>
      </div>
    </div>
  );
}
