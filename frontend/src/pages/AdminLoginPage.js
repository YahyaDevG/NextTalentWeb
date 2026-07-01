import React, { useState } from 'react';
import { api } from '../api';
import { Btn, Alert } from '../components/ui';

const ADMIN_SECRET = process.env.REACT_APP_ADMIN_SECRET || 'nexttalent-admin-2025';

export default function AdminLoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await api.adminLogin(email, password, ADMIN_SECRET);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0F172A',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(99,102,241,.15) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="anim-pop" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, margin: '0 16px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(239,68,68,.4)',
          }}>
            <i className="ti ti-shield-lock" style={{ color: '#fff', fontSize: 28 }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#F8FAFC', letterSpacing: '-.02em' }}>
            Espace Administration
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>NextTalent · Accès restreint</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1E293B', borderRadius: 'var(--radius-xl)',
          border: '1px solid #334155', padding: '28px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,.5)',
        }}>
          {error && <div style={{ marginBottom: 16 }}><Alert type="danger"><i className="ti ti-alert-circle" /> {error}</Alert></div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Email administrateur', value: email, set: setEmail, type: 'email', ph: 'admin@nexttalent.ma' },
              { label: 'Mot de passe', value: password, set: setPassword, type: 'password', ph: '••••••••' },
            ].map(({ label, value, set, type, ph }) => (
              <div key={label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>
                  {label}
                </label>
                <input
                  type={type} value={value} onChange={e => set(e.target.value)}
                  placeholder={ph} required
                  style={{
                    width: '100%', padding: '10px 14px',
                    background: '#0F172A', border: '1.5px solid #334155',
                    borderRadius: 'var(--radius)', color: '#F8FAFC', fontSize: 14, outline: 'none',
                    transition: 'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#EF4444'}
                  onBlur={e => e.target.style.borderColor = '#334155'}
                />
              </div>
            ))}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', marginTop: 4,
              background: loading ? '#374151' : 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius)',
              fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all .15s',
            }}>
              {loading
                ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} /> Connexion...</>
                : <><i className="ti ti-shield-check" /> Accéder au panneau admin</>
              }
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: '#475569' }}>
            <i className="ti ti-lock" style={{ marginRight: 4 }} />
            Accès réservé aux administrateurs NextTalent
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 16 }}>
          URL confidentielle — ne pas partager
        </p>
      </div>
    </div>
  );
}
