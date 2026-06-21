import { useInView } from './useInView'

const STEPS = [
  {
    num: '01',
    title: 'Fill in the short form',
    body: 'Name, number, and a few details about your current cover. Takes two minutes.',
  },
  {
    num: '02',
    title: 'We call you',
    body: 'An adviser calls within one business day to chat through what you have and what you need.',
  },
  {
    num: '03',
    title: 'You get a clear picture',
    body: 'We walk you through what your cover does and doesn\'t include — and whether there\'s a better option across the market.',
  },
  {
    num: '04',
    title: 'Your call from there',
    body: 'No obligation to do anything. If there\'s nothing to improve, we\'ll tell you. If there is, we\'ll show you exactly what it looks like.',
  },
]

export default function HowItWorks() {
  const [ref, inView] = useInView()

  return (
    <section style={{ padding: '0 24px 80px', maxWidth: 960, margin: '0 auto' }}>
      <div
        ref={ref}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 24, padding: 'clamp(36px,5vw,60px) clamp(24px,4vw,52px)',
          position: 'relative', overflow: 'hidden',
          transition: 'opacity 0.7s, transform 0.7s',
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(28px)',
        }}
      >
        {/* Corner accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(45,179,122,0.3) 50%, transparent 100%)',
        }} />

        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--green-light)', marginBottom: 12 }}>
          HOW IT WORKS
        </div>
        <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 36 }}>
          Simple.{' '}
          <span style={{ color: 'var(--green-light)' }}>No pressure.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 36 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`,
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(16px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--green-dim)', border: '1px solid var(--green-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--green-light)',
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{ height: 1, flex: 1, background: 'var(--border)', display: i === STEPS.length - 1 ? 'none' : 'block' }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
