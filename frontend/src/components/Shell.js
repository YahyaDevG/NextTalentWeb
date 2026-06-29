import React from 'react';
import { Avatar } from './ui';

export default function Shell({ session, onLogout, navItems, activeNav, onNav, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gridTemplateRows: '56px 1fr', height: '100vh', overflow: 'hidden' }}>
      {/* Topbar */}
      <div style={{
        gridColumn: '1/-1', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
        boxShadow: '0 1px 0 var(--border)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,var(--indigo),var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ti ti-brain" style={{ color: '#fff', fontSize: 14 }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text)', letterSpacing: '-.01em' }}>NextTalent</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: session.role === 'recruteur' ? '#DCFCE7' : 'var(--indigo-50)',
            color: session.role === 'recruteur' ? '#166534' : 'var(--indigo-dark)',
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, letterSpacing: '.04em',
          }}>
            {session.role === 'recruteur' ? '🏢 Recruteur' : '👤 Candidat'}
          </span>
          <Avatar name={session.nom} size={32} />
          <span style={{ fontSize: 13, fontWeight: 500 }}>{session.nom}</span>
        </div>
      </div>

      {/* Sidebar */}
      <div style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '16px 10px', overflowY: 'auto' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => onNav(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 'var(--radius)', border: 'none', background: activeNav === item.key ? 'var(--indigo-50)' : 'transparent',
              color: activeNav === item.key ? 'var(--indigo)' : 'var(--text-2)',
              fontWeight: activeNav === item.key ? 600 : 400, cursor: 'pointer', fontSize: 13,
              transition: 'all .15s', width: '100%', textAlign: 'left',
            }}
              onMouseEnter={e => { if (activeNav !== item.key) e.currentTarget.style.background = 'var(--bg)'; }}
              onMouseLeave={e => { if (activeNav !== item.key) e.currentTarget.style.background = 'transparent'; }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 17 }} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
          <button onClick={onLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
            borderRadius: 'var(--radius)', border: 'none', background: 'transparent',
            color: 'var(--danger)', cursor: 'pointer', fontSize: 13, width: '100%', transition: 'all .15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <i className="ti ti-logout" style={{ fontSize: 17 }} aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ overflowY: 'auto', padding: '28px 32px', background: 'var(--bg)' }}>
        {children}
      </div>
    </div>
  );
}
