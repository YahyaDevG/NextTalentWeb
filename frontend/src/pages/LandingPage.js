import React, { useEffect, useState, useRef } from 'react';

export default function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // ── Canvas Wave Animation ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const waves = [
      { amp: 60,  freq: 0.008, speed: 0.015, y: 0.72, color: 'rgba(79,70,229,0.22)',  blur: 0  },
      { amp: 45,  freq: 0.010, speed: 0.020, y: 0.78, color: 'rgba(124,58,237,0.18)', blur: 0  },
      { amp: 80,  freq: 0.006, speed: 0.010, y: 0.68, color: 'rgba(99,102,241,0.12)', blur: 0  },
      { amp: 35,  freq: 0.012, speed: 0.025, y: 0.82, color: 'rgba(16,185,129,0.14)', blur: 0  },
      { amp: 100, freq: 0.005, speed: 0.007, y: 0.62, color: 'rgba(79,70,229,0.07)',  blur: 0  },
      { amp: 55,  freq: 0.009, speed: 0.018, y: 0.12, color: 'rgba(124,58,237,0.10)', blur: 0  },
      { amp: 40,  freq: 0.011, speed: 0.022, y: 0.06, color: 'rgba(79,70,229,0.08)',  blur: 0  },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;

      waves.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * w.y);

        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height * w.y
            + Math.sin(x * w.freq + t * w.speed) * w.amp
            + Math.sin(x * w.freq * 1.7 + t * w.speed * 0.8) * (w.amp * 0.4)
            + Math.sin(x * w.freq * 0.5 + t * w.speed * 1.3) * (w.amp * 0.25);
          ctx.lineTo(x, y);
        }

        // Fill to bottom or top depending on wave position
        if (w.y > 0.5) {
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
        } else {
          ctx.lineTo(canvas.width, 0);
          ctx.lineTo(0, 0);
        }
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0,    w.color);
        gradient.addColorStop(0.5,  w.color.replace('0.', '0.').replace(/[\d.]+\)$/, m => String(Math.min(parseFloat(m)*1.6, 1)) + ')'));
        gradient.addColorStop(1,    w.color);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const features = [
    { icon: '🤖', title: 'Analyse IA des CV',    desc: 'Extraction automatique via LLaMA 3.1 — NER, compétences, expériences en quelques secondes.' },
    { icon: '📊', title: 'Matching Hybride',      desc: 'Score sémantique (40%) + compétences (40%) + expérience (20%) pour un classement objectif.' },
    { icon: '💬', title: 'Assistant RAG',         desc: 'Interrogez votre base de candidats en langage naturel comme avec un expert RH.' },
    { icon: '🛡️', title: 'Sécurité Multi-rôles', desc: 'Espaces dédiés et sécurisés pour recruteurs, candidats et administrateurs.' },
  ];

  const stats = [
    { value: '98%', label: 'Précision NER' },
    { value: '10x', label: 'Plus rapide' },
    { value: '∞',   label: 'CV analysés' },
    { value: '3',   label: 'Espaces dédiés' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, #0D0B2B 0%, #060614 60%, #000 100%)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden',
      position: 'relative',
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.95)} }
        @keyframes rotate   { to{transform:rotate(360deg)} }
        @keyframes glow     { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes slide-x  { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

        .btn-cta {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #4F46E5 100%);
          background-size: 200% 100%;
          color: #fff; border: none; border-radius: 14px;
          padding: 17px 44px; font-size: 16px; font-weight: 700;
          cursor: pointer; transition: all .35s ease;
          box-shadow: 0 0 0 0 rgba(79,70,229,.5);
        }
        .btn-cta::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
          animation: slide-x 2.5s infinite;
        }
        .btn-cta:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 0 40px 8px rgba(79,70,229,.45);
          background-position: right center;
        }

        .btn-outline {
          background: transparent;
          color: rgba(255,255,255,.8); 
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 14px; padding: 17px 36px;
          font-size: 16px; font-weight: 500; cursor: pointer;
          transition: all .25s ease; backdrop-filter: blur(8px);
        }
        .btn-outline:hover {
          border-color: rgba(79,70,229,.6);
          background: rgba(79,70,229,.12);
          transform: translateY(-3px);
          color: #fff;
        }

        .feature-card {
          background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 20px; padding: 32px 26px;
          transition: all .35s cubic-bezier(.34,1.2,.64,1);
          cursor: default; position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 20px;
          background: linear-gradient(135deg, rgba(79,70,229,.15), transparent);
          opacity: 0; transition: opacity .35s;
        }
        .feature-card:hover { transform: translateY(-10px) scale(1.02); border-color: rgba(79,70,229,.35); }
        .feature-card:hover::before { opacity: 1; }

        .nav-link {
          color: rgba(255,255,255,.5); font-size: 13px; font-weight: 500;
          text-decoration: none; transition: color .2s; cursor: pointer; letter-spacing: .03em;
        }
        .nav-link:hover { color: #fff; }

        .stat-card {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px; padding: 24px 28px;
          text-align: center; transition: all .25s ease;
        }
        .stat-card:hover {
          background: rgba(79,70,229,.1);
          border-color: rgba(79,70,229,.3);
          transform: translateY(-4px);
        }
      `}</style>

      {/* ── Canvas waves background ── */}
      <canvas ref={canvasRef} style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      }} />

      {/* ── Star field ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {[...Array(60)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width:  `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            borderRadius: '50%',
            background: '#fff',
            left:    `${Math.random() * 100}%`,
            top:     `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
            animation: `glow ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
      </div>

      {/* ── Glow orbs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {[
          { size: 650, top: '-8%',  left: '-8%',  color: 'rgba(79,70,229,.2)',  anim: 'float 14s ease-in-out infinite' },
          { size: 500, bottom: '-5%', right: '-5%', color: 'rgba(124,58,237,.16)', anim: 'float 18s ease-in-out infinite reverse' },
          { size: 280, top: '45%',  left: '45%',  color: 'rgba(16,185,129,.1)',  anim: 'float 10s ease-in-out infinite' },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: o.size, height: o.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            top: o.top, left: o.left, bottom: o.bottom, right: o.right,
            animation: o.anim,
          }} />
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        background: 'rgba(6,6,20,.7)',
        backdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,.06)',
        opacity: visible ? 1 : 0, transition: 'opacity .8s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 0 20px rgba(79,70,229,.5)',
            animation: 'glow 3s ease-in-out infinite',
          }}>💼</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 19, letterSpacing: '-.02em' }}>
            Next<span style={{ background: 'linear-gradient(135deg,#818CF8,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Talent</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span className="nav-link">Fonctionnalités</span>
          <span className="nav-link">Recruteurs</span>
          <span className="nav-link">Candidats</span>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.1)' }} />
          <button className="btn-cta" onClick={onEnter} style={{ padding: '9px 22px', fontSize: 13, borderRadius: 9 }}>
            Accéder →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px', textAlign: 'center',
      }}>

        {/* Rotating ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          border: '1px solid rgba(79,70,229,.12)',
          animation: 'rotate 30s linear infinite',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: -4, left: '50%',
            width: 8, height: 8, borderRadius: '50%',
            background: '#4F46E5', transform: 'translateX(-50%)',
            boxShadow: '0 0 12px 4px rgba(79,70,229,.8)',
          }} />
        </div>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700, borderRadius: '50%',
          border: '1px solid rgba(124,58,237,.08)',
          animation: 'rotate 50s linear infinite reverse',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', bottom: -4, left: '50%',
            width: 6, height: 6, borderRadius: '50%',
            background: '#7C3AED', transform: 'translateX(-50%)',
            boxShadow: '0 0 10px 3px rgba(124,58,237,.8)',
          }} />
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(79,70,229,.12)',
          border: '1px solid rgba(79,70,229,.25)',
          borderRadius: 99, padding: '7px 18px', marginBottom: 36,
          fontSize: 11, color: '#A5B4FC', fontWeight: 700, letterSpacing: '.1em',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .6s .1s ease both' : 'none',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          IA · RECRUTEMENT · MAROC · 2026
        </div>

        {/* Main heading */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(52px, 9vw, 96px)',
          fontWeight: 800, lineHeight: 1.02,
          letterSpacing: '-.045em', marginBottom: 6,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .2s ease both' : 'none',
        }}>
          <span style={{ color: '#fff' }}>Next</span>
          <span style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #A78BFA)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            filter: 'drop-shadow(0 0 30px rgba(99,102,241,.5))',
          }}>Talent</span>
        </h1>

        {/* Domain badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(99,102,241,.12)',
          border: '1px solid rgba(99,102,241,.2)',
          borderRadius: 6, padding: '3px 12px', marginBottom: 28,
          fontSize: 12, color: 'rgba(255,255,255,.4)', letterSpacing: '.12em',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .3s ease both' : 'none',
        }}>
          nexttalent.ma
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(20px, 3.5vw, 30px)',
          fontWeight: 300, color: 'rgba(255,255,255,.85)',
          maxWidth: 700, lineHeight: 1.4, marginBottom: 14,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .4s ease both' : 'none',
        }}>
          Le recrutement intelligent,{' '}
          <span style={{ color: '#818CF8', fontWeight: 600 }}>propulsé par l'IA</span>
        </p>

        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,.35)',
          maxWidth: 500, lineHeight: 1.8, marginBottom: 52,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .5s ease both' : 'none',
        }}>
          Analysez, classez et sélectionnez les meilleurs profils en quelques secondes grâce à l'Intelligence Artificielle générative.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .6s ease both' : 'none',
        }}>
          <button className="btn-cta" onClick={onEnter}>
            🚀 Accéder à la plateforme
          </button>
          <button className="btn-outline" onClick={onEnter}>
            Créer un compte gratuit →
          </button>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14, marginTop: 80, maxWidth: 720, width: '100%',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .8s ease both' : 'none',
        }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 32, fontWeight: 800,
                background: 'linear-gradient(135deg, #fff, #818CF8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '60px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: '#fff', marginBottom: 10,
          }}>
            Une plateforme, toutes les fonctionnalités
          </h2>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 15 }}>
            De l'import du CV jusqu'au choix final du candidat
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: 36, marginBottom: 14, animation: `float ${4 + i}s ease-in-out infinite`, display: 'inline-block' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.38)', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div style={{
          marginTop: 72, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(79,70,229,.1) 0%, rgba(124,58,237,.1) 100%)',
          border: '1px solid rgba(79,70,229,.2)',
          borderRadius: 24, padding: '52px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24,
            background: 'radial-gradient(ellipse at center, rgba(79,70,229,.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 10, position: 'relative' }}>
            Transformez votre recrutement dès aujourd'hui
          </h3>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, marginBottom: 28, position: 'relative' }}>
            Gratuit · Sans carte bancaire · Déploiement instantané
          </p>
          <button className="btn-cta" onClick={onEnter} style={{ position: 'relative', margin: '0 auto' }}>
            🚀 Commencer maintenant
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,.05)',
        padding: '20px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: '#fff' }}>
          Next<span style={{ color: '#818CF8' }}>Talent</span>
          <span style={{ color: 'rgba(255,255,255,.2)', fontWeight: 400, fontSize: 12, marginLeft: 8 }}>© 2026 · nexttalent.ma</span>
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.15)' }}>
          LLaMA 3.1 · SentenceTransformers · FastAPI · React.js · Railway · Vercel
        </span>
      </div>

    </div>
  );
}
