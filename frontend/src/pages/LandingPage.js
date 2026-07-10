import React, { useEffect, useState } from 'react';

export default function LandingPage({ onEnter }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const stats = [
    { value: '98%', label: 'Précision IA' },
    { value: '10x', label: 'Plus rapide' },
    { value: '3', label: 'Rôles distincts' },
  ];

  const features = [
    { icon: '🤖', title: 'Analyse IA des CV', desc: 'Extraction automatique des compétences, expériences et profils via LLaMA 3.1' },
    { icon: '📊', title: 'Matching Hybride', desc: 'Scoring sémantique + compétences + expérience pour un classement objectif' },
    { icon: '💬', title: 'Assistant RAG', desc: 'Interrogez votre base de candidats en langage naturel, comme avec un expert RH' },
    { icon: '🛡️', title: 'Multi-rôles sécurisé', desc: 'Espaces dédiés pour recruteurs, candidats et administrateurs' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A1A',
      color: '#fff',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      overflowX: 'hidden',
    }}>

      {/* ── Animated background ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(79,70,229,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow 1 */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,70,229,.18) 0%, transparent 70%)',
          top: '-10%', left: '-10%',
          animation: 'float1 8s ease-in-out infinite',
        }} />
        {/* Glow 2 */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,.15) 0%, transparent 70%)',
          bottom: '0%', right: '-5%',
          animation: 'float2 10s ease-in-out infinite',
        }} />
        {/* Glow 3 */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,.10) 0%, transparent 70%)',
          top: '50%', left: '50%',
          animation: 'float3 12s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,40px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,-30px)} }
        @keyframes float3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-50%,-50%) scale(1.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .btn-glow:hover { transform:translateY(-3px) scale(1.03); box-shadow: 0 20px 60px rgba(79,70,229,.5) !important; }
        .btn-glow { transition: all .3s cubic-bezier(.34,1.56,.64,1) !important; }
        .feature-card:hover { transform:translateY(-6px); border-color:rgba(79,70,229,.5) !important; background:rgba(79,70,229,.08) !important; }
        .feature-card { transition: all .3s ease !important; }
        .stat-item:hover { transform:scale(1.05); }
        .stat-item { transition: all .2s ease; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(10,10,26,.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(79,70,229,.15)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', letterSpacing: '.05em' }}>nexttalent.ma</span>
          <button
            onClick={onEnter}
            className="btn-glow"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 20px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(79,70,229,.3)',
            }}
          >
            Se connecter →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(79,70,229,.15)', border: '1px solid rgba(79,70,229,.3)',
          borderRadius: 99, padding: '6px 16px', marginBottom: 28,
          fontSize: 12, color: '#A5B4FC', fontWeight: 600, letterSpacing: '.05em',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .6s .1s ease both' : 'none',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          PLATEFORME INTELLIGENTE · RECRUTEMENT IA
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(48px, 8vw, 88px)',
          fontWeight: 800, lineHeight: 1.05,
          letterSpacing: '-.04em', marginBottom: 8,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .2s ease both' : 'none',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #fff 30%, #818CF8 70%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Next</span>
          <span style={{
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Talent</span>
        </h1>

        {/* Domain */}
        <div style={{
          fontSize: 14, color: 'rgba(255,255,255,.3)', marginBottom: 24,
          letterSpacing: '.1em', fontWeight: 500,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .3s ease both' : 'none',
        }}>
          nexttalent.ma
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(18px, 3vw, 26px)',
          fontWeight: 300, color: 'rgba(255,255,255,.75)',
          maxWidth: 640, lineHeight: 1.5, marginBottom: 16,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .4s ease both' : 'none',
        }}>
          Le leader du recrutement intelligent au Maroc
        </p>

        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,.4)',
          maxWidth: 520, lineHeight: 1.7, marginBottom: 48,
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .5s ease both' : 'none',
        }}>
          Analysez des CV en quelques secondes, classez vos candidats par pertinence et trouvez les meilleurs profils grâce à l'Intelligence Artificielle.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .6s ease both' : 'none',
        }}>
          <button
            onClick={onEnter}
            className="btn-glow"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '16px 40px', fontSize: 16, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(79,70,229,.4)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            🚀 Accéder à la plateforme
          </button>
          <button
            onClick={onEnter}
            style={{
              background: 'rgba(255,255,255,.06)', color: '#fff',
              border: '1px solid rgba(255,255,255,.15)', borderRadius: 12,
              padding: '16px 32px', fontSize: 16, fontWeight: 500,
              cursor: 'pointer', transition: 'all .2s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}
          >
            👤 Créer un compte
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          animation: visible ? 'fadeUp .7s .8s ease both' : 'none',
        }}>
          {stats.map(s => (
            <div key={s.label} className="stat-item" style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 36, fontWeight: 800, lineHeight: 1,
                background: 'linear-gradient(135deg, #fff, #818CF8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', marginTop: 6, letterSpacing: '.05em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '80px 24px 120px',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
            color: '#fff', marginBottom: 12,
          }}>
            Tout ce dont vous avez besoin
          </h2>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 16 }}>
            Une plateforme complète pour révolutionner votre processus de recrutement
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{
              background: 'rgba(255,255,255,.03)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 16, padding: '28px 24px',
              cursor: 'default',
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div style={{
          marginTop: 80, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(79,70,229,.15), rgba(124,58,237,.15))',
          border: '1px solid rgba(79,70,229,.25)',
          borderRadius: 24, padding: '48px 32px',
        }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Prêt à transformer votre recrutement ?
          </h3>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 15, marginBottom: 28 }}>
            Rejoignez NextTalent et recrutez plus intelligemment dès aujourd'hui.
          </p>
          <button
            onClick={onEnter}
            className="btn-glow"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px 36px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 8px 32px rgba(79,70,229,.4)',
            }}
          >
            🚀 Commencer maintenant
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,.06)',
        padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14 }}>
            Next<span style={{ color: '#818CF8' }}>Talent</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,.2)', fontSize: 12 }}>© 2026 · nexttalent.ma</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>
          Propulsé par LLaMA 3.1 · SentenceTransformers · FastAPI · React.js
        </div>
      </div>

    </div>
  );
}
