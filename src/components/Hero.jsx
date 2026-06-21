import { useEffect, useRef } from 'react'

function ShieldOrb() {
  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 48px' }}>
      {/* Pulse rings */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(45,179,122,0.15)',
          animation: `pulse-ring ${1.8 + i * 0.5}s ease-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }} />
      ))}
      {/* Glow bg */}
      <div style={{
        position: 'absolute', inset: 20,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,179,122,0.18) 0%, transparent 70%)',
        filter: 'blur(12px)',
      }} />
      {/* Floating card */}
      <div style={{
        position: 'absolute', inset: 24,
        background: 'linear-gradient(145deg, #161E1B 0%, #111816 100%)',
        borderRadius: '50%',
        border: '1px solid rgba(45,179,122,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'float 6s ease-in-out infinite',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(45,179,122,0.08)',
      }}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill="rgba(45,179,122,0.12)"
            stroke="#3DD68C"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="m8.5 12 2.5 2.5 5-5" stroke="#3DD68C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Orbiting dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 8, height: 8, marginLeft: -4, marginTop: -4,
        animation: 'orbit 4s linear infinite',
      }}>
        <style>{`@keyframes orbit { from { transform: rotate(0deg) translateX(72px) rotate(0deg); } to { transform: rotate(360deg) translateX(72px) rotate(-360deg); } }`}</style>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--green-light)',
          boxShadow: '0 0 8px rgba(45,179,122,0.8)',
        }} />
      </div>
    </div>
  )
}

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width = canvas.offsetWidth
    let h = canvas.height = canvas.offsetHeight
    let raf

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.4 + 0.05,
    }))

    function draw() {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(45,179,122,${p.a})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '100px 24px 60px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Canvas particle field */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none',
      }} />

      {/* Background gradient blobs */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700,
          background: 'radial-gradient(ellipse, rgba(45,179,122,0.07) 0%, transparent 65%)',
          animation: 'orb-drift 14s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '-10%',
          width: 400, height: 400,
          background: 'radial-gradient(ellipse, rgba(45,179,122,0.04) 0%, transparent 70%)',
          animation: 'orb-drift 18s ease-in-out infinite reverse',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
        <ShieldOrb />

        <div style={{
          display: 'inline-block', fontSize: 11, fontWeight: 600,
          letterSpacing: '0.1em', color: 'var(--green-light)',
          background: 'var(--green-dim)', border: '1px solid var(--green-border)',
          borderRadius: 40, padding: '6px 14px', marginBottom: 28,
        }}>
          FREE COVER REVIEW · 20 MINUTES · NO OBLIGATION
        </div>

        <h1 style={{
          fontSize: 'clamp(34px,6.5vw,62px)', fontWeight: 900,
          lineHeight: 1.07, letterSpacing: '-0.03em', marginBottom: 22,
        }}>
          Your insurance deserves<br />
          <span style={{ color: 'var(--green-light)' }}>a second opinion.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px,2.5vw,18px)', color: 'var(--muted)',
          maxWidth: 520, margin: '0 auto 44px', lineHeight: 1.75,
        }}>
          Whether you got your cover through a bank, a direct insurer, or years ago online — it's worth knowing if it actually covers what you think it does.
        </p>

        <a
          href="#review"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #2DB37A 0%, #25A06B 100%)',
            color: '#fff', borderRadius: 50, padding: '18px 44px',
            fontSize: 16, fontWeight: 700, textDecoration: 'none',
            letterSpacing: '-0.01em',
            boxShadow: '0 8px 32px rgba(45,179,122,0.3), 0 2px 8px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(45,179,122,0.4), 0 4px 12px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(45,179,122,0.3), 0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          Request your free review →
        </a>

        <p style={{ marginTop: 18, fontSize: 12, color: 'var(--faint)' }}>
          We call you. No pressure, no sales pitch. Just a clear picture of your cover.
        </p>
      </div>
    </div>
  )
}
