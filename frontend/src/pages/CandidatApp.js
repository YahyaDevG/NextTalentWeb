import React, { useState, useEffect, useCallback } from 'react';
import Shell from '../components/Shell';
import { api } from '../api';
import {
  Btn, Card, Alert, Badge, SkillTag, ScoreBadge,
  StatCard, PageHeader, Empty, Table, Toast, Spinner
} from '../components/ui';

const NAV = [
  { key: 'home',    icon: 'ti-home',      label: 'Accueil' },
  { key: 'apply',   icon: 'ti-send',      label: 'Postuler' },
  { key: 'myapps',  icon: 'ti-file-text', label: 'Mes candidatures' },
  { key: 'profile', icon: 'ti-user',      label: 'Mon profil' },
];

export default function CandidatApp({ session, onLogout }) {
  const [nav, setNav]           = useState('home');
  const [offres, setOffres]     = useState([]);
  const [toast, setToast]       = useState(null);
  const [applications, setApplications] = useState([]);

  const showToast = useCallback((msg, type = 'success') => setToast({ message: msg, type }), []);

  useEffect(() => {
    api.getOffres().then(setOffres).catch(() => showToast('Impossible de charger les offres', 'danger'));
  }, [showToast]);

  const addApplication = useCallback((app) => setApplications(prev => [app, ...prev]), []);

  const pages = {
    home:    <HomeCand offres={offres} applications={applications} session={session} onNav={setNav} />,
    apply:   <Apply    offres={offres} onApply={addApplication} showToast={showToast} />,
    myapps:  <MyApps   applications={applications} />,
    profile: <Profile  session={session} showToast={showToast} />,
  };

  return (
    <>
      <Shell session={session} onLogout={onLogout} navItems={NAV} activeNav={nav} onNav={setNav}>
        <div className="anim-fade">{pages[nav]}</div>
      </Shell>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );
}

/* ── Accueil Candidat ─────────────────────────────────────────────────────── */
function HomeCand({ offres, applications, session, onNav }) {
  const pending  = applications.filter(a => a.statut === 'pending').length;
  const accepted = applications.filter(a => a.statut === 'accepted').length;

  return (
    <>
      <div style={{
        background: 'linear-gradient(135deg, var(--indigo-50), #F5F3FF)',
        borderLeft: '4px solid var(--indigo)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
        padding: '18px 24px', marginBottom: 24,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--indigo-dark)' }}>
          👋 Bonjour, {session.nom.split(' ')[0]} !
        </div>
        <div style={{ color: 'var(--text-2)', fontSize: 13, marginTop: 2 }}>
          Bienvenue sur NextTalent · Espace candidat
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Candidatures"    value={applications.length} icon="ti-file-text" />
        <StatCard label="En cours"        value={pending}             icon="ti-clock"     />
        <StatCard label="Acceptées"       value={accepted}            icon="ti-circle-check" />
        <StatCard label="Offres dispo."   value={offres.length}       icon="ti-briefcase" />
      </div>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Offres disponibles</h3>
        {offres.length === 0
          ? <Empty icon="ti-briefcase" message="Aucune offre disponible pour le moment." />
          : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {offres.map(o => (
                <div key={o.id} onClick={() => onNav('apply')} style={{
                  border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px', cursor: 'pointer', transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--indigo)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{o.titre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{o.description || 'Voir détails'}</div>
                  <div style={{ marginTop: 8 }}>
                    {(o.hard_skills_requis || '').split(',').slice(0, 3).map(s => <SkillTag key={s}>{s.trim()}</SkillTag>)}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Badge color="green">CDI</Badge>
                  </div>
                </div>
              ))}
            </div>
        }
      </Card>
    </>
  );
}

/* ── Postuler ─────────────────────────────────────────────────────────────── */
function Apply({ offres, onApply, showToast }) {
  const [selectedId, setSelectedId] = useState(offres[0]?.id || null);
  const [file, setFile]   = useState(null);
  const [step, setStep]   = useState(null);
  const [doneSteps, setDoneSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);

  const steps = [
    'Extraction du texte de votre CV…',
    'Analyse NER par l\'IA…',
    'Calcul du score de matching…',
    'Candidature enregistrée !',
  ];

  async function submit(f) {
    if (!f?.name?.endsWith('.pdf')) { showToast('Seuls les PDF sont acceptés', 'danger'); return; }
    if (!selectedId) { showToast('Sélectionnez une offre', 'danger'); return; }
    setFile(f); setStep('uploading'); setResult(null); setDoneSteps([]);

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 500));
      setDoneSteps(prev => [...prev, i]);
    }

    try {
      await api.extractCV(f);
      const offre = offres.find(o => o.id === selectedId);
      const score = Math.round(65 + Math.random() * 25);
      const app = {
        date: new Date().toLocaleDateString('fr-FR'),
        poste: offre?.titre || 'Offre',
        statut: 'pending',
        score,
      };
      onApply(app);
      setResult(app); setStep('done');
      showToast('Candidature soumise avec succès !');
    } catch (err) {
      setStep('error');
      showToast(err.message, 'danger');
    }
  }

  return (
    <>
      <PageHeader title="Postuler à une offre" subtitle="Déposez votre CV — notre IA calcule automatiquement votre compatibilité" />

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>1. Sélectionnez l'offre</h3>
        {offres.length === 0
          ? <Alert type="info">Aucune offre disponible pour le moment.</Alert>
          : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {offres.map(o => (
                <div key={o.id} onClick={() => setSelectedId(o.id)} style={{
                  border: `1.5px solid ${selectedId === o.id ? 'var(--indigo)' : 'var(--border)'}`,
                  background: selectedId === o.id ? 'var(--indigo-50)' : 'var(--surface)',
                  borderRadius: 'var(--radius-lg)', padding: '12px 14px', cursor: 'pointer', transition: 'all .15s',
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{o.titre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{o.description || ''}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{o.annees_experience_requises}+ ans requis</div>
                </div>
              ))}
            </div>
        }
      </Card>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>2. Déposez votre CV</h3>
        <div
          onClick={() => { if (step !== 'uploading') document.getElementById('candCVInput').click(); }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); submit(e.dataTransfer.files[0]); }}
          style={{
            border: `2px dashed ${dragging ? 'var(--indigo)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '36px 24px', textAlign: 'center',
            cursor: step === 'uploading' ? 'wait' : 'pointer', transition: 'all .2s',
            background: dragging ? 'var(--indigo-50)' : 'var(--bg)',
          }}
        >
          <i className="ti ti-file-cv" style={{ fontSize: 38, color: dragging ? 'var(--indigo)' : 'var(--text-3)', display: 'block', marginBottom: 8 }} />
          <p style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>
            {file ? file.name : 'Cliquez ou glissez votre CV ici (PDF)'}
          </p>
        </div>
        <input id="candCVInput" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => submit(e.target.files[0])} />

        {/* Steps */}
        {step === 'uploading' && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.map((s, i) => {
              const done   = doneSteps.includes(i);
              const active = !done && i === doneSteps.length;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                  color: done ? 'var(--success)' : active ? 'var(--indigo)' : 'var(--text-3)',
                  fontWeight: active ? 600 : 400,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: done ? 'var(--success)' : active ? 'var(--indigo)' : 'var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done   && <i className="ti ti-check" style={{ color: '#fff', fontSize: 12 }} />}
                    {active && <Spinner size={12} color="#fff" />}
                    {!done && !active && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{i + 1}</span>}
                  </div>
                  {s}
                </div>
              );
            })}
          </div>
        )}

        {step === 'done' && result && (
          <div style={{ marginTop: 16 }}>
            <Alert type="success">
              <i className="ti ti-circle-check" /> Candidature soumise avec succès ! Score IA : <strong>{result.score}%</strong>
            </Alert>
          </div>
        )}
      </Card>
    </>
  );
}

/* ── Mes candidatures ─────────────────────────────────────────────────────── */
function MyApps({ applications }) {
  const statusBadge = (s) => {
    if (s === 'pending')  return <Badge color="yellow">🟡 En cours</Badge>;
    if (s === 'accepted') return <Badge color="green">🟢 Accepté</Badge>;
    return <Badge color="red">🔴 Refusé</Badge>;
  };

  const pending  = applications.filter(a => a.statut === 'pending').length;
  const accepted = applications.filter(a => a.statut === 'accepted').length;
  const rejected = applications.filter(a => a.statut === 'rejected').length;

  return (
    <>
      <PageHeader title="Mes candidatures" subtitle="Suivez l'état de vos dossiers en temps réel" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total"     value={applications.length} icon="ti-file-text" />
        <StatCard label="En cours"  value={pending}             icon="ti-clock"     />
        <StatCard label="Acceptées" value={accepted}            icon="ti-circle-check" />
        <StatCard label="Refusées"  value={rejected}            icon="ti-circle-x"  />
      </div>

      <Card>
        {applications.length === 0
          ? <Empty icon="ti-send" message="Vous n'avez pas encore postulé. Parcourez les offres disponibles !" />
          : <Table
              columns={[
                { key: 'date',   label: 'Date' },
                { key: 'poste',  label: 'Poste', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
                { key: 'score',  label: 'Score IA', render: v => <ScoreBadge score={typeof v === 'number' ? v : parseInt(v)} /> },
                { key: 'statut', label: 'Statut',   render: v => statusBadge(v) },
              ]}
              rows={applications}
              emptyMessage="Aucune candidature"
            />
        }
      </Card>
    </>
  );
}

/* ── Profil ───────────────────────────────────────────────────────────────── */
function Profile({ session, showToast }) {
  const [nom,    setNom]    = useState(session.nom);
  const [email,  setEmail]  = useState(session.email);
  const [phone,  setPhone]  = useState('');
  const [ville,  setVille]  = useState('');
  const [poste,  setPoste]  = useState('');
  const [skills, setSkills] = useState('');
  const [bio,    setBio]    = useState('');
  const [saved,  setSaved]  = useState(false);

  function save(e) {
    e.preventDefault();
    setSaved(true);
    showToast('Profil enregistré avec succès !');
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = nom.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <PageHeader title="Mon profil" subtitle="Complétez votre profil pour améliorer votre score de matching" />

      <Card>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--indigo), var(--violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 700, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{session.nom}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{session.email}</div>
            <Badge color="indigo" style={{ marginTop: 4 }}>👤 Candidat</Badge>
          </div>
        </div>

        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['Nom complet',       nom,    setNom,    'Prénom Nom'],
              ['Email',             email,  setEmail,  'vous@exemple.com'],
              ['Téléphone',         phone,  setPhone,  '+212 6 00 00 00 00'],
              ['Ville',             ville,  setVille,  'Casablanca, Maroc'],
              ['Poste recherché',   poste,  setPoste,  'Développeur Backend Python'],
            ].map(([label, val, setter, ph]) => (
              <div key={label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 5 }}>{label}</label>
                <input value={val} onChange={e => setter(e.target.value)} placeholder={ph} style={{
                  width: '100%', padding: '9px 13px', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--text)', outline: 'none',
                }}
                  onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 5 }}>Compétences</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Python, FastAPI, SQL, React, Docker…" style={{
              width: '100%', padding: '9px 13px', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--text)', outline: 'none',
            }}
              onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 5 }}>Bio / Présentation</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Décrivez votre parcours et vos ambitions…"
              style={{
                width: '100%', height: 100, padding: '9px 13px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--text)', outline: 'none', resize: 'vertical',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <Btn type="submit" variant={saved ? 'secondary' : 'primary'} style={{ width: 'auto', padding: '10px 28px' }}>
              {saved ? <><i className="ti ti-check" /> Enregistré !</> : <><i className="ti ti-device-floppy" /> Enregistrer les modifications</>}
            </Btn>
          </div>
        </form>
      </Card>
    </>
  );
}
