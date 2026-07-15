import React, { useEffect, useState } from 'react';

export default function CandidatPage({ onBack, onRegister }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const steps = [
    { num: '01', icon: '👤', title: 'Créez votre profil', desc: 'Inscrivez-vous en quelques secondes et complétez votre profil avec vos compétences et aspirations.' },
    { num: '02', icon: '🔍', title: 'Parcourez les offres', desc: 'Consultez toutes les offres disponibles publiées par les recruteurs et choisissez celle qui vous correspond.' },
    { num: '03', icon: '📄', title: 'Déposez votre CV', desc: 'Uploadez votre CV en PDF. Notre IA l\'analyse instantanément et calcule votre score de compatibilité.' },
    { num: '04', icon: '📊', title: 'Suivez vos candidatures', desc: 'Consultez l\'état de vos candidatures en temps réel avec votre score IA et le statut de chaque dossier.' },
  ];

  const benefits = [
    { icon: '⚡', title: 'Candidature en 30 secondes', desc: 'Déposez votre CV et postulez instantanément sans remplir de longs formulaires.' },
    { icon: '🎯', title: 'Score de compatibilité', desc: 'Voyez immédiatement à quel point votre profil correspond à l\'offre grâce au scoring IA.' },
    { icon: '📱', title: 'Suivi en temps réel', desc: 'Soyez informé de l\'avancement de chaque candidature depuis votre espace personnel.' },
    { icon: '🔒', title: 'CV protégé', desc: 'Vos données sont sécurisées et partagées uniquement avec les recruteurs concernés.' },
    { icon: '🌍', title: 'Offres variées', desc: 'Accédez à des offres dans tous les secteurs tech, IT, digital et bien plus encore.' },
    { icon: '🆓', title: '100% gratuit', desc: 'NextTalent est entièrement gratuit pour les candidats, sans frais cachés.' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 80% 30%, #0B1A2B 0%, #060614 60%, #000 100%)',
      color: '#fff', fontFamily: "'Inter', sans-serif", overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .btn-cta-green {
          background: linear-gradient(135deg,#059669,#10B981); color:#fff; border:none;
          border-radius:14px; padding:17px 44px; font-size:16px; font-weight:700;
          cursor:pointer; transition:all .3s ease; box-shadow:0 8px 32px rgba(16,185,129,.35);
          display:inline-flex; align-items:center; gap:10;
        }
        .btn-cta-green:hover { transform:translateY(-4px) scale(1.03); box-shadow:0 16px 48px rgba(16,185,129,.5); }
        .btn-outline-green {
          background:transparent; color:rgba(255,255,255,.7); border:1px solid rgba(16,185,129,.3);
          border-radius:14px; padding:17px 36px; font-size:16px; font-weight:500; cursor:pointer;
          transition:all .25s ease;
        }
        .btn-outline-green:hover { border-color:rgba(16,185,129,.6); background:rgba(16,185,129,.1); color:#fff; transform:translateY(-2px); }
        .benefit-card {
          background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; padding:24px; transition:all .3s ease;
        }
        .benefit-card:hover { transform:translateY(-6px); border-color:rgba(16,185,129,.35); background:rgba(16,185,129,.06); }
        .step-card {
          background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
          border-radius:20px; padding:28px 24px; transition:all .3s ease; position:relative;
        }
        .step-card:hover { border-color:rgba(16,185,129,.3); background:rgba(16,185,129,.05); transform:translateY(-4px); }
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
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#059669,#10B981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>💼</div>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:18 }}>
            Next<span style={{ color:'#34D399' }}>Talent</span>
          </span>
        </div>
        <button className="btn-cta-green" onClick={onRegister} style={{ padding:'9px 22px', fontSize:13, borderRadius:9 }}>
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
          background:'rgba(16,185,129,.12)', border:'1px solid rgba(16,185,129,.3)',
          borderRadius:99, padding:'7px 18px', marginBottom:28,
          fontSize:11, color:'#6EE7B7', fontWeight:700, letterSpacing:'.1em',
        }}>
          👤 ESPACE CANDIDAT
        </div>
        <h1 style={{
          fontFamily:"'Space Grotesk',sans-serif",
          fontSize:'clamp(36px,6vw,64px)', fontWeight:800, lineHeight:1.1,
          letterSpacing:'-.03em', marginBottom:20,
        }}>
          Trouvez votre{' '}
          <span style={{ background:'linear-gradient(135deg,#10B981,#34D399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            emploi idéal
          </span>
          {' '}grâce à l'IA
        </h1>
        <p style={{ fontSize:17, color:'rgba(255,255,255,.5)', lineHeight:1.75, marginBottom:40, maxWidth:600, margin:'0 auto 40px' }}>
          NextTalent analyse votre CV et vous connecte avec les recruteurs dont les offres correspondent vraiment à votre profil. Fini les candidatures dans le vide.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn-cta-green" onClick={onRegister}>🚀 Créer mon profil candidat</button>
          <button className="btn-outline-green" onClick={onRegister}>Voir les offres →</button>
        </div>
      </div>

      {/* Comment ça marche */}
      <div style={{ position:'relative', zIndex:1, padding:'60px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'clamp(24px,4vw,36px)', fontWeight:700, marginBottom:10 }}>
            Comment postuler ?
          </h2>
          <p style={{ color:'rgba(255,255,255,.35)', fontSize:15 }}>4 étapes simples pour décrocher votre prochain emploi</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:18 }}>
          {steps.map((s, i) => (
            <div key={i} className="step-card">
              <div style={{
                position:'absolute', top:20, right:20,
                fontFamily:"'Space Grotesk',sans-serif", fontSize:42, fontWeight:800,
                color:'rgba(16,185,129,.12)', lineHeight:1,
              }}>{s.num}</div>
              <div style={{ fontSize:32, marginBottom:14, animation:`float ${3+i}s ease-in-out infinite`, display:'inline-block' }}>{s.icon}</div>
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
            Vos avantages en tant que candidat
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
        background:'linear-gradient(135deg,rgba(16,185,129,.1),rgba(5,150,105,.1))',
        border:'1px solid rgba(16,185,129,.2)', borderRadius:24, padding:'56px 32px', textAlign:'center',
      }}>
        <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:30, fontWeight:700, marginBottom:12 }}>
          Votre prochain emploi vous attend
        </h3>
        <p style={{ color:'rgba(255,255,255,.4)', fontSize:14, marginBottom:32 }}>
          Créez votre compte gratuitement et postulez à votre première offre en moins de 2 minutes.
        </p>
        <button className="btn-cta-green" onClick={onRegister}>
          🚀 Commencer gratuitement — 100% sans frais
        </button>
      </div>
    </div>
  );
}
