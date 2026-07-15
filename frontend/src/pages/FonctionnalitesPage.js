import React, { useEffect, useState } from 'react';

export default function FonctionnalitesPage({ onBack, onRegister }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const fonctionnalites = [
    {
      icon: '🤖', color: '#4F46E5', bg: 'rgba(79,70,229,.12)', border: 'rgba(79,70,229,.25)',
      title: 'Extraction NER par IA',
      subtitle: 'Powered by LLaMA 3.1',
      desc: 'Notre moteur d\'IA analyse chaque CV PDF et extrait automatiquement toutes les informations clés : compétences techniques, soft skills, expériences, formations et langues. Fini la saisie manuelle.',
      tags: ['LLaMA 3.1', 'pdfplumber', 'JSON structuré'],
    },
    {
      icon: '📊', color: '#7C3AED', bg: 'rgba(124,58,237,.12)', border: 'rgba(124,58,237,.25)',
      title: 'Matching Hybride',
      subtitle: 'Score sur 3 dimensions',
      desc: 'Un algorithme unique combine trois dimensions pour scorer chaque candidat : similarité sémantique (40%), correspondance des compétences (40%) et niveau d\'expérience (20%). Un score objectif et transparent.',
      tags: ['Sémantique 40%', 'Compétences 40%', 'Expérience 20%'],
    },
    {
      icon: '💬', color: '#0EA5E9', bg: 'rgba(14,165,233,.12)', border: 'rgba(14,165,233,.25)',
      title: 'Assistant RAG',
      subtitle: 'Chat en langage naturel',
      desc: 'Interrogez votre base de candidats comme vous parleriez à un collègue RH. "Trouve-moi un expert Python avec 3 ans d\'expérience" — l\'assistant récupère les profils les plus pertinents instantanément.',
      tags: ['RAG', 'SentenceTransformers', 'LLaMA 3.1'],
    },
    {
      icon: '🏆', color: '#F59E0B', bg: 'rgba(245,158,11,.12)', border: 'rgba(245,158,11,.25)',
      title: 'Classement IA',
      subtitle: 'Résultats en temps réel',
      desc: 'Sélectionnez une offre et obtenez instantanément le classement complet de vos candidats avec le détail de chaque composante du score. Les médailles 🥇🥈🥉 mettent en avant les top profils.',
      tags: ['Temps réel', 'Score détaillé', 'Visualisation'],
    },
    {
      icon: '🛡️', color: '#10B981', bg: 'rgba(16,185,129,.12)', border: 'rgba(16,185,129,.25)',
      title: 'Espace Admin Sécurisé',
      subtitle: 'URL confidentielle',
      desc: 'Un panneau d\'administration complet accessible via une URL secrète avec double authentification. Gérez les utilisateurs, modérez les offres et supervisez toute l\'activité de la plateforme.',
      tags: ['bcrypt', 'RBAC', 'URL secrète'],
    },
    {
      icon: '✉️', color: '#EC4899', bg: 'rgba(236,72,153,.12)', border: 'rgba(236,72,153,.25)',
      title: 'Vérification Email',
      subtitle: 'Sécurité à l\'inscription',
      desc: 'Chaque nouveau compte est sécurisé par une vérification email automatique. Un email HTML professionnel est envoyé avec un lien de confirmation unique valable 24h.',
      tags: ['Resend API', 'Token sécurisé', 'Email HTML'],
    },
  ];

  const stack = [
    { name: 'FastAPI',            role: 'Backend & API REST',        color: '#059669' },
    { name: 'React.js 18',        role: 'Interface Frontend SPA',    color: '#4F46E5' },
    { name: 'PostgreSQL',         role: 'Base de données Cloud',     color: '#0EA5E9' },
    { name: 'LLaMA 3.1 (Groq)',   role: 'Modèle IA / NER / RAG',    color: '#7C3AED' },
    { name: 'SentenceTransformers',role: 'Embeddings sémantiques',   color: '#F59E0B' },
    { name: 'Railway',            role: 'Déploiement Backend',       color: '#EC4899' },
    { name: 'Vercel',             role: 'Déploiement Frontend',      color: '#6366F1' },
    { name: 'Resend',             role: 'Service Email transactionnel',color: '#10B981'},
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 20%, #0D0B2B 0%, #060614 60%, #000 100%)',
      color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .btn-cta {
          background:linear-gradient(135deg,#4F46E5,#7C3AED); color:#fff; border:none;
          border-radius:14px; padding:17px 44px; font-size:16px; font-weight:700;
          cursor:pointer; transition:all .3s ease; box-shadow:0 8px 32px rgba(79,70,229,.4);
          display:inline-flex; align-items:center; gap:10;
        }
        .btn-cta:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 16px 48px rgba(79,70,229,.55); }
        .feat-card {
          border-radius:20px; padding:28px 26px; transition:all .35s ease;
          position:relative; overflow:hidden;
        }
        .feat-card:hover { transform:translateY(-8px) scale(1.02); }
        .stack-item {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          border-radius:12px; padding:16px 18px; transition:all .25s ease;
          display:flex; align-items:center; gap:12;
        }
        .stack-item:hover { background:rgba(255,255,255,.08); transform:translateX(4px); }
        .tag {
          display:inline-block; background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.12);
          border-radius:99px; padding:3px 10px; font-size:11px;
          color:rgba(255,255,255,.5); margin:3px 2px; font-weight:500;
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 48px', height:64,
        background:'rgba(6,6,20,.8)', backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,.06)',
      }}>
        <button onClick={onBack} style={{
          background:'none', border:'none', color:'rgba(255,255,255,.6)', cursor:'pointer',
          display:'flex', alignItems:'center', gap:8, fontSize:14, transition:'color .2s',
        }}
          onMouseEnter={e=>e.currentTarget.style.color='#fff'}
          onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.6)'}
        >
          ← Retour
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#4F46E5,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>💼</div>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:18 }}>
            Next<span style={{ color:'#818CF8' }}>Talent</span>
          </span>
        </div>
        <button className="btn-cta" onClick={onRegister} style={{ padding:'9px 22px', fontSize:13, borderRadius:9 }}>
          Essayer gratuitement
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        position:'relative', zIndex:1, textAlign:'center',
        padding:'140px 24px 72px', maxWidth:800, margin:'0 auto',
        opacity: visible ? 1 : 0, animation: visible ? 'fadeUp .7s .1s ease both' : 'none',
      }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(79,70,229,.15)', border:'1px solid rgba(79,70,229,.3)',
          borderRadius:99, padding:'7px 18px', marginBottom:28,
          fontSize:11, color:'#A5B4FC', fontWeight:700, letterSpacing:'.1em',
        }}>
          ⚡ TOUTES LES FONCTIONNALITÉS
        </div>
        <h1 style={{
          fontFamily:"'Space Grotesk',sans-serif",
          fontSize:'clamp(34px,6vw,60px)', fontWeight:800, lineHeight:1.1,
          letterSpacing:'-.03em', marginBottom:20,
        }}>
          Une plateforme,{' '}
          <span style={{ background:'linear-gradient(135deg,#6366F1,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            toutes les fonctionnalités
          </span>
        </h1>
        <p style={{ fontSize:16, color:'rgba(255,255,255,.45)', lineHeight:1.75, maxWidth:580, margin:'0 auto 40px' }}>
          Découvrez l'ensemble des technologies et fonctionnalités qui font de NextTalent la plateforme de recrutement IA la plus avancée du marché marocain.
        </p>
      </div>

      {/* Fonctionnalités */}
      <div style={{ position:'relative', zIndex:1, padding:'20px 24px 60px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20 }}>
          {fonctionnalites.map((f, i) => (
            <div key={i} className="feat-card" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{
                  width:48, height:48, borderRadius:12, fontSize:22,
                  background:`${f.color}22`, border:`1px solid ${f.color}44`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  animation:`float ${3+i*0.5}s ease-in-out infinite`,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:16, color:'#fff' }}>{f.title}</div>
                  <div style={{ fontSize:12, color:f.color, fontWeight:600, letterSpacing:'.04em' }}>{f.subtitle}</div>
                </div>
              </div>
              <p style={{ fontSize:13.5, color:'rgba(255,255,255,.42)', lineHeight:1.7, marginBottom:14 }}>{f.desc}</p>
              <div>{f.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stack technique */}
      <div style={{ position:'relative', zIndex:1, padding:'40px 24px 60px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(22px,4vw,34px)', fontWeight:700, marginBottom:8 }}>
            Stack Technique
          </h2>
          <p style={{ color:'rgba(255,255,255,.3)', fontSize:14 }}>Les technologies qui propulsent NextTalent</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:12 }}>
          {stack.map((s, i) => (
            <div key={i} className="stack-item">
              <div style={{
                width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0,
                boxShadow:`0 0 8px ${s.color}`,
              }} />
              <div>
                <div style={{ fontWeight:600, fontSize:14, color:'#fff' }}>{s.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.35)' }}>{s.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div style={{
        position:'relative', zIndex:1, margin:'0 24px 80px',
        maxWidth:900, marginLeft:'auto', marginRight:'auto',
        background:'linear-gradient(135deg,rgba(79,70,229,.12),rgba(124,58,237,.12))',
        border:'1px solid rgba(79,70,229,.22)', borderRadius:24, padding:'56px 32px', textAlign:'center',
      }}>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:28, fontWeight:700, marginBottom:12 }}>
          Testez toutes ces fonctionnalités gratuitement
        </h3>
        <p style={{ color:'rgba(255,255,255,.4)', fontSize:14, marginBottom:32 }}>
          Créez votre compte en 30 secondes et découvrez la puissance du recrutement IA.
        </p>
        <button className="btn-cta" onClick={onRegister}>
          🚀 Commencer maintenant — C'est gratuit
        </button>
      </div>
    </div>
  );
}
