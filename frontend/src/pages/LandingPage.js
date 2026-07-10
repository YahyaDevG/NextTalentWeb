import React, { useEffect, useState } from 'react';

export default function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const stats = [
    { value: '98%', label: 'Précision IA' },
    { value: '10x', label: 'Plus rapide' },
    { value: '3',   label: 'Rôles distincts' },
  ];

  const features = [
    { icon: '🤖', title: 'Analyse IA des CV',    desc: 'Extraction automatique des compétences, expériences et profils via LLaMA 3.1' },
    { icon: '📊', title: 'Matching Hybride',      desc: 'Scoring sémantique + compétences + expérience pour un classement objectif' },
    { icon: '💬', title: 'Assistant RAG',         desc: 'Interrogez votre base de candidats en langage naturel, comme avec un expert RH' },
    { icon: '🛡️', title: 'Multi-rôles sécurisé', desc: 'Espaces dédiés pour recruteurs, candidats et administrateurs' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      color: '#fff',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        /* ── Waves ── */
        .wave-container {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .wave {
          position: absolute; bottom: 0; left: 0; width: 200%; height: 100%;
          opacity: .18;
        }
        .wave1 { animation: wave-move1 12s linear infinite; }
        .wave2 { animation: wave-move2 16s linear infinite; opacity: .12; }
        .wave3 { animation: wave-move3 20s linear infinite; opacity: .08; }
        .wave4 { animation: wave-move4 9s  linear infinite; opacity: .14; }

        @keyframes wave-move1 { 0%{transform:translateX(0)}   100%{transform:translateX(-50%)} }
        @keyframes wave-move2 { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }
        @keyframes wave-move3 { 0%{transform:translateX(0)}   100%{transform:translateX(-50%)} }
        @keyframes wave-move4 { 0%{transform:translateX(-50%)} 100%{transform:translateX(0)} }

        /* ── Particles ── */
        .particle {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(79,70,229,.8), transparent);
          animation: particle-float linear infinite;
        }
        @keyframes particle-float {
          0%   { transform: translateY(100vh) scale(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: .5; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }

        /* ── Grid overlay ── */
        .grid-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(79,70,229,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,70,229,.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* ── Glow orbs ── */
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .orb1 {
          width: 700px; height: 700px; top: -15%; left: -15%;
          background: radial-gradient(circle, rgba(79,70,229,.25) 0%, transparent 70%);
          animation: orb-move1 15s ease-in-out infinite;
        }
        .orb2 {
          width: 500px; height: 500px; bottom: -10%; right: -10%;
          background: radial-gradient(circle, rgba(124,58,237,.2) 0%, transparent 70%);
          animation: orb-move2 18s ease-in-out infinite;
        }
        .orb3 {
          width: 350px; height: 350px; top: 40%; left: 40%;
          background: radial-gradient(circle, rgba(16,185,129,.12) 0%, transparent 70%);
          animation: orb-move3 22s ease-in-out infinite;
        }
        @keyframes orb-move1 { 0%,100%{transform:translate(0,0)}  50%{transform:translate(60px,80px)} }
        @keyframes orb-move2 { 0%,100%{transform:translate(0,0)}  50%{transform:translate(-80px,-60px)} }
        @keyframes orb-move3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.4)} }

        /* ── Animations ── */
        @keyframes fadeUp  { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes shimmer {
          0%   { background-position: -200% center }
          100% { background-position:  200% center }
        }

        /* ── Buttons ── */
        .btn-primary {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: #fff; border: none; border-radius: 14px;
          padding: 16px 40px; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all .3s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 8px 32px rgba(79,70,229,.4);
          display: flex; align-items: center; gap: 10;
        }
        .btn-primary:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 20px 60px rgba(79,70,229,.55);
        }
        .btn-secondary {
          background: rgba(255,255,255,.06);
          color: #fff; border: 1px solid rgba(255,255,255,.15);
          border-radius: 14px; padding: 16px 32px;
          font-size: 16px; font-weight: 500; cursor: pointer;
          transition: all .25s ease;
          display: flex; align-items: center; gap: 8;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,.12);
          border-color: rgba(255,255,255,.3);
          transform: translateY(-2px);
        }
        .btn-nav {
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: #fff; border: none; border-radius: 9px;
          padding: 9px 22px; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .25s ease;
          box-shadow: 0 4px 16px rgba(79,70,229,.35);
        }
        .btn-nav:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(79,70,229,.5); }

        /* ── Feature cards ── */
        .feature-card {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px; padding: 28px 24px;
          transition: all .3s ease; cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(79,70,229,.4);
          background: rgba(79,70,229,.07);
          box-shadow: 0 20px 40px rgba(79,70,229,.15);
        }

        .stat-item { transition: transform .2s ease; text-align: center; }
        .stat-item:hover { transform: scale(1.08); }
      `}</style>

      {/* ══════ BACKGROUND ══════ */}

      {/* Grid */}
      <div className="grid-overlay" />

      {/* Glow orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      {/* Animated waves */}
      <div className="wave-container">
        {/* Wave 1 — indigo */}
        <svg className="wave wave1" viewBox="0 0 1440 320" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, height: '40%' }}>
          <path fill="url(#grad1)" d="
            M0,160 C180,220 360,80 540,160 C720,240 900,80 1080,160
            C1260,240 1380,120 1440,160 L1440,320 L0,320 Z
            M1440,160 C1620,220 1800,80 1980,160 C2160,240 2340,80 2520,160
            C2700,240 2820,120 2880,160 L2880,320 L1440,320 Z
          "/>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#4F46E5" />
              <stop offset="50%"  stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 2 — violet */}
        <svg className="wave wave2" viewBox="0 0 1440 320" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, height: '35%' }}>
          <path fill="url(#grad2)" d="
            M0,200 C240,120 480,260 720,180 C960,100 1200,240 1440,200
            L1440,320 L0,320 Z
            M1440,200 C1680,120 1920,260 2160,180 C2400,100 2640,240 2880,200
            L2880,320 L1440,320 Z
          "/>
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#7C3AED" />
              <stop offset="50%"  stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 3 — cyan/green accent */}
        <svg className="wave wave3" viewBox="0 0 1440 320" preserveAspectRatio="none"
          style={{ position: 'absolute', bottom: 0, height: '28%' }}>
          <path fill="url(#grad3)" d="
            M0,240 C360,160 720,300 1080,220 C1260,180 1380,260 1440,240
            L1440,320 L0,320 Z
            M1440,240 C1800,160 2160,300 2520,220 C2700,180 2820,260 2880,240
            L2880,320 L1440,320 Z
          "/>
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#10B981" />
              <stop offset="50%"  stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 4 — top waves */}
        <svg className="wave wave4" viewBox="0 0 1440 200" preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, height: '25%', transform: 'rotate(180deg)' }}>
          <path fill="url(#grad4)" d="
            M0,100 C360,40 720,160 1080,80 C1260,40 1380,120 1440,100
            L1440,200 L0,200 Z
            M1440,100 C1800,40 2160,160 2520,80 C2700,40 2820,120 2880,100
            L2880,200 L1440,200 Z
          "/>
          <defs>
            <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#4F46E5" stopOpacity="0.5"/>
              <stop offset="50%"  stopColor="#7C3AED" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.5"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="particle" style={{
          width:  `${4 + Math.random() * 8}px`,
          height: `${4 + Math.random() * 8}px`,
          left:   `${Math.random() * 100}%`,
          animationDuration: `${8 + Math.random() * 12}s`,
          animationDelay:    `${Math.random() * 10}s`,
        }} />
      ))}

      {/* ══════ NAVBAR ══════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(5,5,16,.75)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(79,70,229,.12)',
        opacity: visible ? 1 : 0,
        transition: 'opacity .8s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 16px rgba(79,70,229,.4)',
          }}>💼</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>
            Next<span style={{ color: '#818CF8' }}>Talent</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', letterSpacing: '.06em' }}>nexttalent.ma</span>
          <button className="btn-nav" onClick={onEnter}>Se connecter →</button>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', textAlign: 'center',
      }}>

        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(79,70,229,.15)', border: '1px solid rgba(79,70,229,.3)',
          borderRadius: 99, padding: '7px 18px', marginBottom: 32,
          fontSize: 11, color: '#A5B4FC', fontWeight: 700, letterSpacing: '.08em',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .6s .1s ease both' : 'none',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
          PLATEFORME IA · RECRUTEMENT INTELLIGENT · MAROC
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(56px, 10vw, 100px)',
          fontWeight: 800, lineHeight: 1.02,
          letterSpacing: '-.04em', marginBottom: 8,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .2s ease both' : 'none',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #fff 20%, #C7D2FE 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Next</span>
          <span style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Talent</span>
        </h1>

        {/* Domain */}
        <div style={{
          fontSize: 13, color: 'rgba(255,255,255,.25)', marginBottom: 24,
          letterSpacing: '.12em', fontWeight: 500,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .3s ease both' : 'none',
        }}>nexttalent.ma</div>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 300, color: 'rgba(255,255,255,.8)',
          maxWidth: 680, lineHeight: 1.45, marginBottom: 14,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .4s ease both' : 'none',
        }}>
          Le leader du recrutement intelligent au Maroc
        </p>

        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,.38)',
          maxWidth: 520, lineHeight: 1.75, marginBottom: 52,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .5s ease both' : 'none',
        }}>
          Analysez des CV en quelques secondes, classez vos candidats par pertinence et trouvez les meilleurs profils grâce à l'Intelligence Artificielle.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .6s ease both' : 'none',
        }}>
          <button className="btn-primary" onClick={onEnter}>
            🚀 Accéder à la plateforme
          </button>
          <button className="btn-secondary" onClick={onEnter}>
            👤 Créer un compte
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 60, marginTop: 80, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .8s ease both' : 'none',
        }}>
          {stats.map(s => (
            <div key={s.label} className="stat-item">
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 40, fontWeight: 800, lineHeight: 1,
                background: 'linear-gradient(135deg, #fff 30%, #818CF8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 7, letterSpacing: '.08em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: .4, animation: 'pulse 2s infinite',
        }}>
          <span style={{ fontSize: 11, color: '#fff', letterSpacing: '.08em' }}>DÉFILER</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        </div>
      </div>

      {/* ══════ FEATURES ══════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '80px 24px 60px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
            background: 'linear-gradient(135deg, #fff, #A5B4FC)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 12,
          }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ color: 'rgba(255,255,255,.35)', fontSize: 16 }}>
            Une plateforme complète pour révolutionner votre processus de recrutement
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 38, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{
          marginTop: 80, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(79,70,229,.12), rgba(124,58,237,.12))',
          border: '1px solid rgba(79,70,229,.22)',
          borderRadius: 24, padding: '56px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,70,229,.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, marginBottom: 12, position: 'relative', zIndex: 1 }}>
            Prêt à transformer votre recrutement ?
          </h3>
          <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 15, marginBottom: 32, position: 'relative', zIndex: 1 }}>
            Rejoignez NextTalent et recrutez plus intelligemment dès aujourd'hui.
          </p>
          <button className="btn-primary" onClick={onEnter} style={{ margin: '0 auto', position: 'relative', zIndex: 1 }}>
            🚀 Commencer maintenant — C'est gratuit
          </button>
        </div>
      </div>

      {/* ══════ FOOTER ══════ */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14 }}>
          Next<span style={{ color: '#818CF8' }}>Talent</span>
          <span style={{ color: 'rgba(255,255,255,.2)', fontWeight: 400, fontSize: 12, marginLeft: 10 }}>© 2026 · nexttalent.ma</span>
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,.18)' }}>
          Propulsé par LLaMA 3.1 · SentenceTransformers · FastAPI · React.js
        </span>
      </div>

    </div>
  );
}
