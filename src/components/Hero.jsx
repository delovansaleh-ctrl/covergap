export default function Hero() {
  const scrollToForm = () => {
    const el = document.getElementById('review')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      minHeight: '100vh',
      background: '#26215C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '120px 24px 80px',
    }}>
      <div style={{ maxWidth: 700 }}>
        <h1 style={{
          fontSize: 'clamp(30px, 5.2vw, 56px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          marginBottom: 24,
        }}>
          Most Kiwis set up their insurance once — and never look at it again.
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2.2vw, 20px)',
          color: 'rgba(255,255,255,0.72)',
          lineHeight: 1.65,
          maxWidth: 480,
          margin: '0 auto 44px',
        }}>
          Your cover made sense when you got it. Does it still?
        </p>

        <button
          onClick={scrollToForm}
          style={{
            background: '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            padding: '17px 44px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            boxShadow: '0 8px 28px rgba(16,185,129,0.35)',
            transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(16,185,129,0.45)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(16,185,129,0.35)'
          }}
        >
          Free cover review
        </button>
      </div>
    </section>
  )
}
