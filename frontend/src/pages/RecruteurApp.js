import React, { useState, useEffect, useRef, useCallback } from 'react';
import Shell from '../components/Shell';
import { api } from '../api';
import {
  Btn, Card, Alert, Badge, SkillTag, ScoreBadge,
  StatCard, PageHeader, Empty, Table, Toast, Spinner, Input, Select
} from '../components/ui';

const NAV = [
  { key: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { key: 'import',    icon: 'ti-upload',            label: 'Importer des CV' },
  { key: 'offres',    icon: 'ti-briefcase',         label: 'Offres d\'emploi' },
  { key: 'ranking',   icon: 'ti-chart-bar',         label: 'Classement IA' },
  { key: 'chat',      icon: 'ti-message-dots',      label: 'Assistant RAG' },
];

export default function RecruteurApp({ session, onLogout }) {
  const [nav, setNav]             = useState('dashboard');
  const [candidats, setCandidats] = useState([]);
  const [offres, setOffres]       = useState([]);
  const [toast, setToast]         = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [c, o] = await Promise.all([api.getCandidats(), api.getOffres()]);
      setCandidats(c);
      setOffres(o);
    } catch {
      showToast('Impossible de contacter le serveur', 'danger');
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const pages = {
    dashboard: <Dashboard candidats={candidats} offres={offres} onNav={setNav} />,
    import:    <ImportCV  candidats={candidats} onRefresh={loadData} showToast={showToast} />,
    offres:    <Offres    offres={offres} onRefresh={loadData} showToast={showToast} onNav={setNav} />,
    ranking:   <Ranking   offres={offres} />,
    chat:      <ChatRAG   />,
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

/* ── Dashboard ────────────────────────────────────────────────────────────── */
function Dashboard({ candidats, offres, onNav }) {
  const topMatch = candidats.filter(c => (c.annees_experience || 0) >= 3).length;
  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bienvenue — Vue d'ensemble du recrutement intelligent`}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Candidats analysés" value={candidats.length} delta="Base IA à jour"       icon="ti-users"      />
        <StatCard label="Offres actives"      value={offres.length}    delta="Matching disponible"  icon="ti-briefcase"  />
        <StatCard label="Top profils (3+ ans)" value={topMatch}        delta="Expérience confirmée" icon="ti-star"       />
        <StatCard label="Score IA moyen"      value="—"               delta="Lancez un classement" icon="ti-chart-bar"  />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Candidats récents</h3>
          {candidats.length === 0
            ? <Empty icon="ti-users" message="Aucun candidat importé. Commencez par uploader des CV." action={<Btn size="sm" onClick={() => onNav('import')}>Importer un CV</Btn>} />
            : <Table
                columns={[
                  { key: 'nom_complet',       label: 'Nom' },
                  { key: 'dernier_poste',     label: 'Poste', render: v => v || '—' },
                  { key: 'annees_experience', label: 'Exp.', render: v => v ? `${v} ans` : '—' },
                ]}
                rows={candidats.slice(0, 6)}
              />
          }
        </Card>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Offres ouvertes</h3>
          {offres.length === 0
            ? <Empty icon="ti-briefcase" message="Aucune offre créée." action={<Btn size="sm" onClick={() => onNav('offres')}>Créer une offre</Btn>} />
            : offres.map(o => (
                <div key={o.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{o.titre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{o.description || 'Pas de description'}</div>
                  <div style={{ marginTop: 6 }}>
                    {(o.hard_skills_requis || '').split(',').slice(0, 3).map(s => <SkillTag key={s}>{s.trim()}</SkillTag>)}
                  </div>
                </div>
              ))
          }
        </Card>
      </div>
    </>
  );
}

/* ── Import CV ────────────────────────────────────────────────────────────── */
function ImportCV({ candidats, onRefresh, showToast }) {
  const [file, setFile]         = useState(null);
  const [step, setStep]         = useState(null); // null | 'uploading' | 'done' | 'error'
  const [result, setResult]     = useState(null);
  const [errMsg, setErrMsg]     = useState('');
  const [dragging, setDragging] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const inputRef = useRef();

  const steps = [
    { key: 'extract', label: 'Extraction du texte (pdfplumber)' },
    { key: 'ner',     label: 'Analyse NER par l\'IA (LLaMA 3.1)' },
    { key: 'store',   label: 'Calcul des embeddings & stockage' },
  ];
  const [doneSteps, setDoneSteps] = useState([]);

  async function processFile(f) {
    if (!f || !f.name.endsWith('.pdf')) { showToast('Seuls les fichiers PDF sont acceptés', 'danger'); return; }
    setFile(f); setStep('uploading'); setResult(null); setErrMsg(''); setDoneSteps([]);

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 400));
      setDoneSteps(prev => [...prev, steps[i].key]);
    }

    try {
      const data = await api.extractCV(f);
      setResult(data); setStep('done');
      showToast('CV analysé et stocké avec succès !');
      onRefresh();
    } catch (err) {
      setStep('error'); setErrMsg(err.message);
    }
  }

  async function handleDelete(id) {
    setDeleting(id);
    try { await api.deleteCandidat(id); onRefresh(); showToast('Candidat supprimé'); }
    catch (err) { showToast(err.message, 'danger'); }
    finally { setDeleting(null); }
  }

  const stepState = (key) => {
    if (doneSteps.includes(key)) return 'done';
    const idx = steps.findIndex(s => s.key === key);
    const lastDone = doneSteps.length;
    if (idx === lastDone && step === 'uploading') return 'active';
    return 'pending';
  };

  return (
    <>
      <PageHeader title="Importer des CV" subtitle="Analysez des CV PDF avec l'IA — extraction NER et structuration automatique" />

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Déposer un CV (PDF)</h3>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
          style={{
            border: `2px dashed ${dragging ? 'var(--indigo)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center',
            cursor: 'pointer', transition: 'all .2s',
            background: dragging ? 'var(--indigo-50)' : 'var(--bg)',
          }}
        >
          <i className="ti ti-file-upload" style={{ fontSize: 40, color: dragging ? 'var(--indigo)' : 'var(--text-3)', display: 'block', marginBottom: 10 }} />
          <p style={{ fontSize: 14, color: dragging ? 'var(--indigo)' : 'var(--text-2)', fontWeight: 500 }}>
            {file ? file.name : 'Cliquez ou glissez un fichier PDF ici'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Format accepté : PDF uniquement · Max 10 MB</p>
        </div>
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />

        {/* Progress steps */}
        {step === 'uploading' && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.map(s => {
              const state = stepState(s.key);
              return (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                  color: state === 'done' ? 'var(--success)' : state === 'active' ? 'var(--indigo)' : 'var(--text-3)',
                  fontWeight: state === 'active' ? 600 : 400,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: state === 'done' ? 'var(--success)' : state === 'active' ? 'var(--indigo)' : 'var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {state === 'done'   && <i className="ti ti-check" style={{ color: '#fff', fontSize: 12 }} />}
                    {state === 'active' && <Spinner size={12} color="#fff" />}
                    {state === 'pending'&& <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{steps.findIndex(ss => ss.key === s.key) + 1}</span>}
                  </div>
                  {s.label}
                </div>
              );
            })}
          </div>
        )}

        {/* Result */}
        {step === 'done' && result && (
          <div style={{ marginTop: 20 }}>
            <Alert type="success"><i className="ti ti-circle-check" /> CV analysé et stocké avec succès !</Alert>
            <Card style={{ marginTop: 12, background: 'var(--bg)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Profil extrait par l'IA</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[
                  ['Nom complet',  result.nom_complet || '—'],
                  ['Email',        result.email || '—'],
                  ['Téléphone',    result.telephone || '—'],
                  ['Dernier poste',result.dernier_poste || '—'],
                  ['Expérience',   result.annees_experience != null ? `${result.annees_experience} ans` : '—'],
                  ['Langues',      (result.langues || []).join(', ') || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 6 }}>Compétences détectées</div>
              <div>{(result.hard_skills || []).map(s => <SkillTag key={s}>{s}</SkillTag>)}</div>
            </Card>
          </div>
        )}

        {step === 'error' && (
          <div style={{ marginTop: 16 }}>
            <Alert type="danger"><i className="ti ti-alert-circle" /> {errMsg}</Alert>
          </div>
        )}
      </Card>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Base de candidats ({candidats.length})</h3>
        {candidats.length === 0
          ? <Empty icon="ti-users" message="Aucun candidat importé. Uploadez votre premier CV ci-dessus." />
          : <Table
              columns={[
                { key: 'nom_complet',       label: 'Candidat', render: (v, row) => <div><div style={{ fontWeight: 600 }}>{v || '—'}</div><div style={{ fontSize: 11, color: 'var(--text-2)' }}>{row.email || ''}</div></div> },
                { key: 'dernier_poste',     label: 'Poste',    render: v => v || '—' },
                { key: 'annees_experience', label: 'Exp.',     render: v => v ? `${v} ans` : '—' },
                { key: 'hard_skills',       label: 'Compétences', render: v => (v || '').split(',').slice(0,3).map(s => <SkillTag key={s}>{s.trim()}</SkillTag>) },
                { key: 'id', label: '', render: (v) => (
                  <Btn variant="danger" size="sm" loading={deleting === v} onClick={() => handleDelete(v)}>
                    <i className="ti ti-trash" />
                  </Btn>
                )},
              ]}
              rows={candidats}
              emptyMessage="Aucun candidat"
            />
        }
      </Card>
    </>
  );
}

/* ── Offres ───────────────────────────────────────────────────────────────── */
function Offres({ offres, onRefresh, showToast, onNav }) {
  const [titre,   setTitre]   = useState('');
  const [desc,    setDesc]    = useState('');
  const [skills,  setSkills]  = useState('');
  const [exp,     setExp]     = useState(3);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(null);
  const [msg,     setMsg]     = useState(null);

  async function createOffre(e) {
    e.preventDefault();
    if (!titre.trim() || !skills.trim()) { setMsg({ type: 'warning', text: 'Titre et compétences sont requis.' }); return; }
    setSaving(true); setMsg(null);
    try {
      await api.createOffre({
        titre, description: desc,
        hard_skills_requis: skills.split(',').map(s => s.trim()).filter(Boolean),
        annees_experience_requises: Number(exp),
      });
      showToast('Offre créée avec succès !');
      setTitre(''); setDesc(''); setSkills(''); setExp(3);
      onRefresh();
    } catch (err) {
      showToast(err.message, 'danger');
    } finally { setSaving(false); }
  }

  async function deleteOffre(id) {
    setDeleting(id);
    try { await api.deleteOffre(id); onRefresh(); showToast('Offre supprimée'); }
    catch (err) { showToast(err.message, 'danger'); }
    finally { setDeleting(null); }
  }

  return (
    <>
      <PageHeader title="Offres d'emploi" subtitle="Créez et gérez vos offres pour activer le matching IA" />

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Nouvelle offre</h3>
        {msg && <div style={{ marginBottom: 12 }}><Alert type={msg.type}>{msg.text}</Alert></div>}
        <form onSubmit={createOffre} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="Titre du poste" value={titre} onChange={setTitre} placeholder="Ex: Développeur Python Senior" />
            <Input label="Description"    value={desc}  onChange={setDesc}  placeholder="CDI · Ville · Salaire" />
          </div>
          <Input label="Compétences requises (séparées par des virgules)" value={skills} onChange={setSkills} placeholder="Python, FastAPI, SQL, Docker" />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: 8 }}>
              Années d'expérience requises : <span style={{ color: 'var(--indigo)', fontWeight: 700 }}>{exp}</span>
            </label>
            <input type="range" min={0} max={15} value={exp} onChange={e => setExp(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--indigo)' }} />
          </div>
          <div>
            <Btn type="submit" loading={saving}>
              <i className="ti ti-plus" /> Créer l'offre
            </Btn>
          </div>
        </form>
      </Card>

      <Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Offres actives ({offres.length})</h3>
        {offres.length === 0
          ? <Empty icon="ti-briefcase" message="Aucune offre créée. Ajoutez votre première offre ci-dessus." />
          : offres.map(o => (
            <div key={o.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{o.titre}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>{o.description || 'Pas de description'} · {o.annees_experience_requises}+ ans</div>
                <div style={{ marginTop: 6 }}>
                  {(o.hard_skills_requis || '').split(',').map(s => <SkillTag key={s}>{s.trim()}</SkillTag>)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Btn variant="secondary" size="sm" onClick={() => { onNav('ranking'); }}>
                  <i className="ti ti-chart-bar" /> Classer
                </Btn>
                <Btn variant="danger" size="sm" loading={deleting === o.id} onClick={() => deleteOffre(o.id)}>
                  <i className="ti ti-trash" />
                </Btn>
              </div>
            </div>
          ))
        }
      </Card>
    </>
  );
}

/* ── Ranking ──────────────────────────────────────────────────────────────── */
function Ranking({ offres }) {
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [ranking, setRanking]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');

  async function loadRanking(offreId) {
    setSelectedOffre(offreId); setLoading(true); setError(''); setRanking([]);
    try {
      const data = await api.getRanking(offreId);
      setRanking(data);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      <PageHeader title="Classement IA des candidats" subtitle="Matching hybride : sémantique (40%) + compétences (40%) + expérience (20%)" />

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Sélectionner une offre</h3>
        {offres.length === 0
          ? <Alert type="info">Aucune offre disponible. Créez d'abord une offre d'emploi.</Alert>
          : <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {offres.map(o => (
                <Btn key={o.id} variant={selectedOffre === o.id ? 'primary' : 'outline'} size="sm" onClick={() => loadRanking(o.id)}>
                  {o.titre}
                </Btn>
              ))}
            </div>
        }
      </Card>

      {loading && (
        <Card style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24 }}>
          <Spinner /> <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Calcul du matching IA en cours...</span>
        </Card>
      )}

      {error && <Alert type="danger"><i className="ti ti-alert-circle" /> {error}</Alert>}

      {ranking.length > 0 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>
              Résultats — {offres.find(o => o.id === selectedOffre)?.titre}
            </h3>
            <Badge color="indigo">{ranking.length} candidats classés</Badge>
          </div>

          {ranking.map((c, i) => (
            <div key={c.id} className="anim-fade" style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
              borderBottom: i < ranking.length - 1 ? '1px solid var(--border)' : 'none',
              animationDelay: `${i * 0.05}s`,
            }}>
              {/* Rank */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: i < 3 ? 'linear-gradient(135deg, var(--indigo), var(--violet))' : 'var(--surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i < 3 ? 16 : 13, fontWeight: 700, color: i < 3 ? '#fff' : 'var(--text-2)',
              }}>
                {i < 3 ? medals[i] : i + 1}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nom_complet || '—'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>
                  {c.dernier_poste || '—'} · {c.annees_experience || 0} ans
                </div>
                <div style={{ marginTop: 5 }}>
                  {(c.hard_skills || '').split(',').slice(0, 4).map(s => <SkillTag key={s}>{s.trim()}</SkillTag>)}
                </div>
              </div>

              {/* Score details */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--indigo)' }}>
                  {c.score_final}%
                </div>
                <ScoreBadge score={c.score_final} />
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                  Sem. {c.score_semantique}% · Skills {c.score_skills}% · Exp. {c.score_experience}%
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {!loading && !error && ranking.length === 0 && !selectedOffre && (
        <Alert type="info"><i className="ti ti-info-circle" /> Sélectionnez une offre ci-dessus pour lancer le classement IA.</Alert>
      )}
    </>
  );
}

/* ── Chat RAG ─────────────────────────────────────────────────────────────── */
function ChatRAG() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant NextTalent. Je peux vous aider à trouver les meilleurs profils dans votre base de candidats. Que recherchez-vous ?' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const { reponse } = await api.chat(q);
      setMessages(prev => [...prev, { role: 'assistant', content: reponse }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Erreur de connexion au serveur. Vérifiez que le backend est démarré.' }]);
    } finally { setLoading(false); }
  }

  const suggestions = [
    'Trouve un expert Python avec 3+ ans d\'expérience',
    'Quel candidat maîtrise FastAPI et SQL ?',
    'Qui parle anglais et arabe ?',
    'Classe les candidats par expérience',
  ];

  return (
    <>
      <PageHeader title="Assistant RH IA (RAG)" subtitle="Interrogez votre base de candidats en langage naturel · Powered by LLaMA 3.1" />

      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: 400 }}>
        {/* Suggestions */}
        {messages.length === 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => { setInput(s); }} style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '7px 13px', fontSize: 12, color: 'var(--text-2)', cursor: 'pointer', transition: 'all .15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--indigo)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', background: 'var(--bg)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          border: '1px solid var(--border)', borderBottom: 'none', padding: 16,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '75%', padding: '11px 15px', borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.role === 'user' ? 'linear-gradient(135deg, var(--indigo), var(--violet))' : 'var(--surface)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                fontSize: 13, lineHeight: 1.6, boxShadow: 'var(--shadow-sm)',
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Spinner size={16} />
              <span style={{ fontSize: 12, color: 'var(--text-2)', animation: 'pulse 1s infinite' }}>
                L'assistant analyse votre question...
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: 8, padding: 12, background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ex: Trouve-moi un expert Python avec plus de 3 ans d'expérience…"
            style={{
              flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text)', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--indigo)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <Btn onClick={send} loading={loading} style={{ flexShrink: 0 }}>
            <i className="ti ti-send" /> Envoyer
          </Btn>
        </div>
      </div>
    </>
  );
}
