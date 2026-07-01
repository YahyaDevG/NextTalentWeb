import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { Btn, Card, Alert, Badge, SkillTag, StatCard, PageHeader, Empty, Table, Toast, Spinner, Input } from '../components/ui';

const NAV = [
  { key: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { key: 'users',     icon: 'ti-users',             label: 'Utilisateurs' },
  { key: 'offres',    icon: 'ti-briefcase',         label: 'Offres' },
  { key: 'candidats', icon: 'ti-file-cv',           label: 'CV / Candidats' },
  { key: 'settings',  icon: 'ti-settings',          label: 'Paramètres' },
];

export default function AdminApp({ session, onLogout }) {
  const [nav,   setNav]   = useState('dashboard');
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

  const pages = {
    dashboard: <AdminDashboard />,
    users:     <AdminUsers     showToast={showToast} />,
    offres:    <AdminOffres    showToast={showToast} />,
    candidats: <AdminCandidats showToast={showToast} />,
    settings:  <AdminSettings  showToast={showToast} session={session} />,
  };

  return (
    <>
      {/* Admin Shell */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gridTemplateRows: '56px 1fr', height: '100vh', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          gridColumn: '1/-1', background: '#0F172A', borderBottom: '1px solid #1E293B',
          display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#EF4444,#DC2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ti ti-shield-lock" style={{ color: '#fff', fontSize: 14 }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#F8FAFC' }}>NextTalent</span>
            <span style={{ background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '.05em' }}>ADMIN</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>{session.nom}</span>
            <button onClick={onLogout} style={{
              background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.3)',
              color: '#EF4444', borderRadius: 'var(--radius)', padding: '6px 14px',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <i className="ti ti-logout" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ background: '#0F172A', borderRight: '1px solid #1E293B', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.08em', padding: '4px 12px 10px' }}>
            Panneau admin
          </div>
          {NAV.map(item => (
            <button key={item.key} onClick={() => setNav(item.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 'var(--radius)', border: 'none',
              background: nav === item.key ? 'rgba(239,68,68,.15)' : 'transparent',
              color: nav === item.key ? '#EF4444' : '#64748B',
              fontWeight: nav === item.key ? 600 : 400, cursor: 'pointer', fontSize: 13,
              transition: 'all .15s', width: '100%', textAlign: 'left',
            }}
              onMouseEnter={e => { if (nav !== item.key) e.currentTarget.style.background = 'rgba(255,255,255,.05)'; }}
              onMouseLeave={e => { if (nav !== item.key) e.currentTarget.style.background = 'transparent'; }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 17 }} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ overflowY: 'auto', padding: '28px 32px', background: '#0F172A' }}>
          <div className="anim-fade">{pages[nav]}</div>
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}

/* ── Shared styles ──────────────────────────────────────────────────────────── */
const darkCard = { background: '#1E293B', border: '1px solid #334155', color: '#F8FAFC' };
const darkText = { color: '#F8FAFC' };
const mutedText = { color: '#94A3B8' };

/* ── Dashboard ────────────────────────────────────────────────────────────── */
function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.adminStats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader
        title={<span style={darkText}>Dashboard Admin</span>}
        subtitle={<span style={mutedText}>Vue globale de la plateforme NextTalent</span>}
      />

      {loading && <div style={{ display: 'flex', gap: 10, alignItems: 'center', ...mutedText }}><Spinner /><span>Chargement...</span></div>}
      {error   && <Alert type="danger">{error}</Alert>}

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total utilisateurs', value: stats.total_users,      icon: 'ti-users',         color: '#6366F1' },
            { label: 'Recruteurs',         value: stats.total_recruteurs,  icon: 'ti-building',      color: '#10B981' },
            { label: 'Candidats',          value: stats.total_candidats,   icon: 'ti-user',          color: '#3B82F6' },
            { label: 'Comptes bloqués',    value: stats.total_blocked,     icon: 'ti-lock',          color: '#EF4444' },
            { label: 'CV importés',        value: stats.total_cv,          icon: 'ti-file-cv',       color: '#F59E0B' },
            { label: 'Offres actives',     value: stats.total_offres,      icon: 'ti-briefcase',     color: '#8B5CF6' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: '#F8FAFC' }}>{value}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={`ti ${icon}`} style={{ fontSize: 20, color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', marginBottom: 12 }}>
            <i className="ti ti-shield-check" style={{ color: '#10B981', marginRight: 8 }} />
            Sécurité
          </div>
          <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>
            ✅ URL admin confidentielle<br />
            ✅ Clé secrète requise à la connexion<br />
            ✅ Rôle admin vérifié côté serveur<br />
            ✅ Impossible de supprimer/modifier un admin
          </div>
        </div>
        <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '18px 20px' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', marginBottom: 12 }}>
            <i className="ti ti-info-circle" style={{ color: '#6366F1', marginRight: 8 }} />
            Accès rapide
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Gérer les utilisateurs', 'users', '#6366F1'],
              ['Modérer les offres', 'offres', '#10B981'],
              ['Voir les CV importés', 'candidats', '#F59E0B'],
            ].map(([label, _, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94A3B8' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Users ────────────────────────────────────────────────────────────────── */
function AdminUsers({ showToast }) {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [acting,   setActing]   = useState(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');

  const load = useCallback(() => {
    setLoading(true);
    api.adminGetUsers().then(setUsers).catch(e => showToast(e.message, 'danger')).finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  async function toggleBlock(user) {
    setActing(user.id);
    try {
      await api.adminBlockUser(user.id, !user.is_blocked);
      showToast(user.is_blocked ? 'Compte débloqué' : 'Compte bloqué');
      load();
    } catch (e) { showToast(e.message, 'danger'); }
    finally { setActing(null); }
  }

  async function deleteUser(user) {
    if (!window.confirm(`Supprimer définitivement ${user.nom} ?`)) return;
    setActing(user.id);
    try {
      await api.adminDeleteUser(user.id);
      showToast('Utilisateur supprimé');
      load();
    } catch (e) { showToast(e.message, 'danger'); }
    finally { setActing(null); }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.nom.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'blocked' ? u.is_blocked : u.role === filter);
    return matchSearch && matchFilter;
  });

  const roleBadge = (role) => {
    const map = { recruteur: ['green','🏢 Recruteur'], candidat: ['indigo','👤 Candidat'], admin: ['red','🛡️ Admin'] };
    const [color, label] = map[role] || ['gray', role];
    return <Badge color={color}>{label}</Badge>;
  };

  return (
    <>
      <PageHeader title={<span style={darkText}>Gestion des utilisateurs</span>} subtitle={<span style={mutedText}>{users.length} comptes enregistrés</span>} />

      {/* Filters */}
      <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '14px 18px', marginBottom: 18, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher par nom ou email…"
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: 'var(--radius)', color: '#F8FAFC', fontSize: 13, outline: 'none' }}
        />
        {['all', 'recruteur', 'candidat', 'blocked'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 14px', borderRadius: 'var(--radius)', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            background: filter === f ? '#EF4444' : '#1E293B',
            color: filter === f ? '#fff' : '#94A3B8',
            border: `1px solid ${filter === f ? '#EF4444' : '#334155'}`,
          }}>
            {{ all: 'Tous', recruteur: 'Recruteurs', candidat: 'Candidats', blocked: 'Bloqués' }[f]}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#64748B', padding: 20 }}><Spinner /><span>Chargement...</span></div>
        : (
          <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['Utilisateur', 'Rôle', 'Inscription', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '.07em', textTransform: 'uppercase', padding: '10px 14px', borderBottom: '1px solid #334155' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#475569', fontSize: 13 }}>Aucun utilisateur trouvé</td></tr>
                  : filtered.map(u => (
                    <tr key={u.id}
                      style={{ borderBottom: '1px solid #1E293B', opacity: u.is_blocked ? .6 : 1 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1E293B'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '11px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#F8FAFC' }}>{u.nom}</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '11px 14px' }}>{roleBadge(u.role)}</td>
                      <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748B' }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {u.role === 'admin'
                          ? <Badge color="red">Admin protégé</Badge>
                          : u.is_blocked
                          ? <Badge color="red">🔴 Bloqué</Badge>
                          : <Badge color="green">🟢 Actif</Badge>
                        }
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {u.role !== 'admin' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => toggleBlock(u)} disabled={acting === u.id} style={{
                              padding: '5px 12px', borderRadius: 'var(--radius)', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                              background: u.is_blocked ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.2)',
                              color: u.is_blocked ? '#10B981' : '#EF4444',
                            }}>
                              {acting === u.id ? '...' : u.is_blocked ? '✓ Débloquer' : '⊘ Bloquer'}
                            </button>
                            <button onClick={() => deleteUser(u)} disabled={acting === u.id} style={{
                              padding: '5px 10px', borderRadius: 'var(--radius)', border: '1px solid #334155',
                              background: 'transparent', color: '#EF4444', fontSize: 12, cursor: 'pointer',
                            }}>
                              <i className="ti ti-trash" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )
      }
    </>
  );
}

/* ── Offres ───────────────────────────────────────────────────────────────── */
function AdminOffres({ showToast }) {
  const [offres,   setOffres]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(() => {
    api.adminGetOffres().then(setOffres).catch(e => showToast(e.message, 'danger')).finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  async function deleteOffre(id, titre) {
    if (!window.confirm(`Supprimer l'offre "${titre}" ?`)) return;
    setDeleting(id);
    try { await api.adminDeleteOffre(id); showToast('Offre supprimée'); load(); }
    catch (e) { showToast(e.message, 'danger'); }
    finally { setDeleting(null); }
  }

  return (
    <>
      <PageHeader title={<span style={darkText}>Modération des offres</span>} subtitle={<span style={mutedText}>{offres.length} offres sur la plateforme</span>} />

      {loading
        ? <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#64748B', padding: 20 }}><Spinner /><span>Chargement...</span></div>
        : offres.length === 0
        ? <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center', color: '#64748B' }}>
            <i className="ti ti-briefcase" style={{ fontSize: 36, display: 'block', marginBottom: 10 }} />
            Aucune offre sur la plateforme
          </div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {offres.map(o => (
              <div key={o.id} style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC' }}>{o.titre}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{o.description || 'Pas de description'}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                    {o.annees_experience_requises}+ ans requis · Créée le {o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—'}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {(o.hard_skills_requis || '').split(',').slice(0, 4).map(s => <SkillTag key={s}>{s.trim()}</SkillTag>)}
                  </div>
                </div>
                <button onClick={() => deleteOffre(o.id, o.titre)} disabled={deleting === o.id} style={{
                  padding: '7px 12px', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,.3)',
                  background: 'rgba(239,68,68,.1)', color: '#EF4444', cursor: 'pointer', fontSize: 13, flexShrink: 0,
                }}>
                  {deleting === o.id ? '...' : <i className="ti ti-trash" />}
                </button>
              </div>
            ))}
          </div>
      }
    </>
  );
}

/* ── Candidats ────────────────────────────────────────────────────────────── */
function AdminCandidats({ showToast }) {
  const [candidats, setCandidats] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);
  const [search,    setSearch]    = useState('');

  const load = useCallback(() => {
    api.adminGetCandidats().then(setCandidats).catch(e => showToast(e.message, 'danger')).finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  async function deleteCV(id, nom) {
    if (!window.confirm(`Supprimer le CV de "${nom}" ?`)) return;
    setDeleting(id);
    try { await api.deleteCandidat(id); showToast('CV supprimé'); load(); }
    catch (e) { showToast(e.message, 'danger'); }
    finally { setDeleting(null); }
  }

  const filtered = candidats.filter(c =>
    (c.nom_complet || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.dernier_poste || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title={<span style={darkText}>CV & Candidats importés</span>} subtitle={<span style={mutedText}>{candidats.length} profils dans la base</span>} />

      <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 16 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher par nom, email ou poste…"
          style={{ width: '100%', padding: '8px 12px', background: '#0F172A', border: '1px solid #334155', borderRadius: 'var(--radius)', color: '#F8FAFC', fontSize: 13, outline: 'none' }}
        />
      </div>

      {loading
        ? <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#64748B', padding: 20 }}><Spinner /><span>Chargement...</span></div>
        : filtered.length === 0
        ? <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: 40, textAlign: 'center', color: '#64748B' }}>
            <i className="ti ti-file-cv" style={{ fontSize: 36, display: 'block', marginBottom: 10 }} />
            Aucun CV importé
          </div>
        : <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0F172A' }}>
                  {['Candidat', 'Poste', 'Expérience', 'Compétences', 'Date import', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '.07em', textTransform: 'uppercase', padding: '10px 14px', borderBottom: '1px solid #334155' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #1E293B' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#1E293B'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#F8FAFC' }}>{c.nom_complet || '—'}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{c.email || '—'}</div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: '#94A3B8' }}>{c.dernier_poste || '—'}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: '#94A3B8' }}>{c.annees_experience ? `${c.annees_experience} ans` : '—'}</td>
                    <td style={{ padding: '11px 14px' }}>
                      {(c.hard_skills || '').split(',').slice(0, 3).map(s => <SkillTag key={s}>{s.trim()}</SkillTag>)}
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748B' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <button onClick={() => deleteCV(c.id, c.nom_complet)} disabled={deleting === c.id} style={{
                        padding: '5px 10px', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,.3)',
                        background: 'rgba(239,68,68,.1)', color: '#EF4444', cursor: 'pointer', fontSize: 13,
                      }}>
                        {deleting === c.id ? '...' : <i className="ti ti-trash" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </>
  );
}

/* ── Settings ─────────────────────────────────────────────────────────────── */
function AdminSettings({ showToast, session }) {
  const [nom,      setNom]      = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);

  async function createAdmin(e) {
    e.preventDefault();
    if (!nom || !email || !password) { showToast('Tous les champs sont requis', 'danger'); return; }
    setCreating(true);
    try {
      await api.adminCreateAdmin(nom, email, password);
      showToast('Compte admin créé avec succès !');
      setNom(''); setEmail(''); setPassword('');
    } catch (e) { showToast(e.message, 'danger'); }
    finally { setCreating(false); }
  }

  const fieldStyle = {
    width: '100%', padding: '10px 13px', background: '#0F172A',
    border: '1.5px solid #334155', borderRadius: 'var(--radius)',
    color: '#F8FAFC', fontSize: 14, outline: 'none',
  };

  return (
    <>
      <PageHeader title={<span style={darkText}>Paramètres système</span>} subtitle={<span style={mutedText}>Configuration avancée de NextTalent</span>} />

      {/* Current admin info */}
      <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', marginBottom: 12 }}>
          <i className="ti ti-user-shield" style={{ color: '#EF4444', marginRight: 8 }} />
          Administrateur connecté
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['Nom', session.nom], ['Email', session.email], ['Rôle', 'Administrateur'], ['ID', `#${session.user_id}`]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Create admin */}
      <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '18px 22px', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', marginBottom: 16 }}>
          <i className="ti ti-user-plus" style={{ color: '#6366F1', marginRight: 8 }} />
          Créer un nouveau compte admin
        </div>
        <form onSubmit={createAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Nom complet', val: nom,      set: setNom,      type: 'text',     ph: 'Prénom Nom' },
              { label: 'Email',       val: email,    set: setEmail,    type: 'email',    ph: 'admin@nexttalent.ma' },
            ].map(({ label, val, set, type, ph }) => (
              <div key={label}>
                <label style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 5 }}>{label}</label>
                <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} style={fieldStyle}
                  onFocus={e => e.target.style.borderColor = '#EF4444'} onBlur={e => e.target.style.borderColor = '#334155'}
                />
              </div>
            ))}
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#64748B', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 5 }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe sécurisé" style={fieldStyle}
              onFocus={e => e.target.style.borderColor = '#EF4444'} onBlur={e => e.target.style.borderColor = '#334155'}
            />
          </div>
          <button type="submit" disabled={creating} style={{
            padding: '10px 24px', background: creating ? '#374151' : 'linear-gradient(135deg,#6366F1,#7C3AED)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 700, fontSize: 14,
            cursor: creating ? 'not-allowed' : 'pointer', width: 'fit-content',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <i className="ti ti-user-plus" />
            {creating ? 'Création...' : 'Créer le compte admin'}
          </button>
        </form>
      </div>

      {/* Security info */}
      <div style={{ ...darkCard, borderRadius: 'var(--radius-lg)', padding: '18px 22px' }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#F8FAFC', marginBottom: 12 }}>
          <i className="ti ti-info-circle" style={{ color: '#F59E0B', marginRight: 8 }} />
          Informations de sécurité
        </div>
        <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.8 }}>
          • URL admin : <code style={{ color: '#94A3B8', background: '#0F172A', padding: '1px 6px', borderRadius: 4 }}>/nexttalent-admin</code><br />
          • Clé secrète : définie dans la variable d'environnement <code style={{ color: '#94A3B8', background: '#0F172A', padding: '1px 6px', borderRadius: 4 }}>ADMIN_SECRET</code><br />
          • Les mots de passe sont hashés avec bcrypt<br />
          • Les comptes admin ne peuvent pas être supprimés ou modifiés par d'autres admins
        </div>
      </div>
    </>
  );
}
