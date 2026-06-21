import { useEffect, useState } from 'react'

const HEADLINE_WORDS = [
  { text: 'Most',      delay: 0 },
  { text: 'Kiwis',     delay: 0.08 },
  { text: 'set',       delay: 0.16 },
  { text: 'up',        delay: 0.22 },
  { text: 'their',     delay: 0.28 },
  { text: 'insurance', delay: 0.36, accent: true },
  { text: 'once',      delay: 0.44, accent: true },
  { text: '—',         delay: 0.56 },
  { text: 'and',       delay: 0.72 },
  { text: 'never',     delay: 0.8 },
  { text: 'look',      delay: 0.88 },
  { text: 'at',        delay: 0.94 },
  { text: 'it',        delay: 1.0 },
  { text: 'again.',    delay: 1.06 },
]

export default function Hero() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  const scrollToForm = () => {
    const el = document.getElementById('review')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        @keyframes word-rise {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cta-pop {
          0%   { opacity: 0; transform: translateY(10px) scale(0.97); }
          60%  { transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        .hero-word {
          display: inline-block;
          opacity: 0;
          animation: word-rise 0.48s cubic-bezier(0.16,1,0.3,1) forwards;
          margin-right: 0.28em;
          white-space: nowrap;
        }
        .hero-word.accent { color: #a78bfa; }
        .hero-sub {
          opacity: 0;
          animation: fade-up 0.5s cubic-bezier(0.16,1,0.3,1) 1.5s forwards;
        }
        .hero-cta {
          opacity: 0;
          animation: cta-pop 0.55s cubic-bezier(0.16,1,0.3,1) 1.9s forwards;
        }
        .hero-scroll-hint {
          opacity: 0;
          animation: fade-up 0.4s ease 2.5s forwards;
        }
        .hero-cta-btn {
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .hero-cta-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 14px 40px rgba(16,185,129,0.45) !important;
        }
        .hero-cta-btn:active {
          transform: scale(0.97) !important;
        }
      `}</style>

      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1e1a4a 0%, #26215C 55%, #1d1635 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 0',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* radial glow behind text */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 640, height: 640, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680 }}>

          {/* Animated headline */}
          <h1 style={{
            fontSize: 'clamp(30px, 5.2vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: 28,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {ready && HEADLINE_WORDS.map((w, i) => (
              <span
                key={i}
                className={`hero-word${w.accent ? ' accent' : ''}`}
                style={{ animationDelay: `${w.delay}s` }}
              >
                {w.text}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p className="hero-sub" style={{
            fontSize: 'clamp(16px, 2.2vw, 19px)',
            color: 'rgba(255,255,255,0.62)',
            lineHeight: 1.7,
            maxWidth: 400,
            margin: '0 auto 44px',
          }}>
            Your cover made sense when you got it.<br />Does it still?
          </p>

          {/* CTA button */}
          <div className="hero-cta">
            <button
              className="hero-cta-btn"
              onClick={scrollToForm}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 50,
                padding: '17px 46px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 8px 28px rgba(16,185,129,0.35)',
              }}
            >
              Find out in 90 seconds →
            </button>
          </div>

          {/* Scroll hint */}
          <div className="hero-scroll-hint" style={{
            marginTop: 48,
            paddingBottom: 24,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            color: 'rgba(255,255,255,0.25)', fontSize: 12, letterSpacing: '0.05em',
          }}>
            <span>scroll to begin</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              style={{ animation: 'bounce-arrow 1.8s ease-in-out infinite' }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" stroke="rgba(255,255,255,0.28)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Gradient bleed into form section */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 180,
          background: 'linear-gradient(to bottom, transparent 0%, var(--surface) 100%)',
          pointerEvents: 'none',
        }} />
      </section>
    </>
  )
}
