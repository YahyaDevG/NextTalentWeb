import React, { useEffect, useState } from 'react';

export default function RecruteurPage({ onBack, onRegister }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const steps = [
    { num: '01', icon: '📋', title: 'Créez votre offre', desc: 'Définissez le poste, les compétences requises et le niveau d\'expérience souhaité en quelques clics.' },
    { num: '02', icon: '📄', title: 'Importez les CV', desc: 'Glissez-déposez les CV PDF reçus. Notre IA les analyse instantanément et extrait toutes les informations clés.' },
    { num: '03', icon: '🤖', title: 'L\'IA classe les candidats', desc: 'NextTalent calcule un score hybride pour chaque candidat : similarité sémantique, compétences et expérience.' },
    { num: '04', icon: '🏆', title: 'Choisissez le meilleur profil', desc: 'Consultez le classement, interrogez l\'assistant RAG et prenez votre décision en toute confiance.' },
  ];

  const benefits = [
    { icon: '⚡', title: 'Gain de temps x10', desc: 'Analysez 100 CV en quelques secondes au lieu de plusieurs heures.' },
    { icon: '🎯', title: 'Objectivité totale', desc: 'Éliminez les biais humains grâce à un scoring basé sur les données.' },
    { icon: '💬', title: 'Assistant RH 24/7', desc: 'Posez des questions en langage naturel sur vos candidats à tout moment.' },
    { icon: '📊', title: 'Tableau de bord complet', desc: 'Suivez vos offres, candidats et KPIs depuis un seul espace.' },
    { icon: '🔒', title: 'Données sécurisées', desc: 'Vos données sont chiffrées et hébergées de manière sécurisée.' },
    { icon: '🚀', title: 'Démarrage immédiat', desc: 'Créez votre compte et publiez votre première offre en moins de 5 minutes.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 30%, #0D0B2B 0%, #060614 60%, #000 100%)',
      color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes glow   { 0%,100%{opacity:.7} 50%{opacity:1} }
        .btn-cta {
          background: linear-gradient(135deg,#4F46E5,#7C3AED); color:#fff; border:none;
          border-radius:14px; padding:17px 44px; font-size:16px; font-weight:700;
          cursor:pointer; transition:all .3s ease; box-shadow:0 8px 32px rgba(79,70,229,.4);
          display:inline-flex; align-items:center; gap:10;
        }
        .btn-cta:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 16px 48px rgba(79,70,229,.55); }
        .btn-outline {
          background:transparent; color:rgba(255,255,255,.7); border:1px solid rgba(255,255,255,.2);
          border-radius:14px; padding:17px 36px; font-size:16px; font-weight:500; cursor:pointer;
          transition:all .25s ease;
        }
        .btn-outline:hover { border-color:rgba(79,70,229,.5); background:rgba(79,70,229,.1); color:#fff; transform:translateY(-2px); }
        .benefit-card {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; padding:24px; transition:all .3s ease;
        }
        .benefit-card:hover { transform:translateY(-6px); border-color:rgba(79,70,229,.35); background:rgba(79,70,229,.08); }
        .step-card {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
          border-radius:20px; padding:28px 24px; transition:all .3s ease; position:relative;
        }
        .step-card:hover { border-color:rgba(79,70,229,.3); background:rgba(79,70,229,.06); transform:translateY(-4px); }
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
          S'inscrire gratuitement
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        position:'relative', zIndex:1, textAlign:'center',
        padding:'140px 24px 80px', maxWidth:800, margin:'0 auto',
        opacity: visible ? 1 : 0, animation: visible ? 'fadeUp .7s .1s ease both' : 'none',
      }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(79,70,229,.15)', border:'1px solid rgba(79,70,229,.3)',
          borderRadius:99, padding:'7px 18px', marginBottom:28,
          fontSize:11, color:'#A5B4FC', fontWeight:700, letterSpacing:'.1em',
        }}>
          🏢 ESPACE RECRUTEUR
        </div>
        <h1 style={{
          fontFamily:"'Space Grotesk',sans-serif",
          fontSize:'clamp(36px,6vw,64px)', fontWeight:800, lineHeight:1.1,
          letterSpacing:'-.03em', marginBottom:20,
        }}>
          Recrutez{' '}
          <span style={{ background:'linear-gradient(135deg,#6366F1,#A78BFA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            10x plus vite
          </span>
          {' '}avec l'IA
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,.5)', lineHeight:1.75, marginBottom:40, maxWidth:600, margin:'0 auto 40px' }}>
          NextTalent automatise l'analyse de vos CV et le classement de vos candidats grâce à l'Intelligence Artificielle. Concentrez-vous sur les entretiens, pas sur le tri.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn-cta" onClick={onRegister}>🚀 Créer mon compte recruteur</button>
          <button className="btn-outline" onClick={onRegister}>Voir la démo →</button>
        </div>
      </div>

      {/* Comment ça marche */}
      <div style={{ position:'relative', zIndex:1, padding:'60px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(24px,4vw,36px)', fontWeight:700, marginBottom:10 }}>
            Comment ça marche ?
          </h2>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:15 }}>4 étapes simples pour recruter intelligemment</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:18 }}>
          {steps.map((s, i) => (
            <div key={i} className="step-card" style={{ animationDelay:`${i*0.1}s` }}>
              <div style={{
                position:'absolute', top:20, right:20,
                fontFamily:"'Space Grotesk',sans-serif", fontSize:42, fontWeight:800,
                color:'rgba(79,70,229,.15)', lineHeight:1,
              }}>{s.num}</div>
              <div style={{ fontSize:32, marginBottom:14, animation:`float ${3+i}s ease-in-out infinite` }}>{s.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, color:'#fff', marginBottom:8 }}>{s.title}</div>
              <div style={{ fontSize:13.5, color:'rgba(255,255,255,.38)', lineHeight:1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Avantages */}
      <div style={{ position:'relative', zIndex:1, padding:'40px 24px 60px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(24px,4vw,36px)', fontWeight:700, marginBottom:10 }}>
            Pourquoi choisir NextTalent ?
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
          {benefits.map((b, i) => (
            <div key={i} className="benefit-card">
              <div style={{ fontSize:28, marginBottom:10 }}>{b.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, color:'#fff', marginBottom:6 }}>{b.title}</div>
              <div style={{ fontSize:13.5, color:'rgba(255,255,255,.38)', lineHeight:1.65 }}>{b.desc}</div>
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
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:30, fontWeight:700, marginBottom:12 }}>
          Prêt à révolutionner votre recrutement ?
        </h3>
        <p style={{ color:'rgba(255,255,255,.4)', fontSize:14, marginBottom:32 }}>
          Créez votre compte gratuitement et importez votre premier CV en moins de 5 minutes.
        </p>
        <button className="btn-cta" onClick={onRegister}>
          🚀 Commencer gratuitement — Sans carte bancaire
        </button>
      </div>
    </div>
  );
}
