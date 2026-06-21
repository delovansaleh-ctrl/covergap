import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px', height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(11,15,14,0.92)' : 'rgba(11,15,14,0.6)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>
        cover<span style={{ color: 'var(--green-light)' }}>gap</span>
      </div>
      <a
        href="#review"
        style={{
          background: 'var(--green)', color: '#fff', border: 'none',
          borderRadius: 40, padding: '9px 22px', fontSize: 13, fontWeight: 700,
          textDecoration: 'none', letterSpacing: '-0.01em',
          transition: 'background 0.2s, transform 0.15s',
          display: 'inline-block',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#25A06B'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--green)'}
      >
        Get your free review
      </a>
    </nav>
  )
}
