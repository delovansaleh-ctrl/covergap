import { useInView } from './useInView'

const BANK_ITEMS = [
  'Can only recommend their own products',
  'No needs analysis — standardised products',
  'Cover designed for the average customer',
  'You\'re on your own at claim time',
]
const ADVISER_ITEMS = [
  'Works across every major NZ insurer',
  'Assesses your health, income, and situation',
  'Cover structured around you specifically',
  'Supports you through claims',
]

function CrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <path d="m15 9-6 6M9 9l6 6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="9" stroke="#2DB37A" strokeWidth="1.5" />
      <path d="m9 12 2 2 4-4" stroke="#2DB37A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function WhyAdviser() {
  const [headRef, headInView] = useInView()
  const [gridRef, gridInView] = useInView()
  const [quoteRef, quoteInView] = useInView()

  return (
    <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
      <div ref={headRef} style={{
        transition: 'opacity 0.6s, transform 0.6s',
        opacity: headInView ? 1 : 0,
        transform: headInView ? 'none' : 'translateY(20px)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--green-light)', marginBottom: 14 }}>
          WHY AN ADVISER
        </div>
        <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14 }}>
          A bank can only show you<br />
          <span style={{ color: 'var(--green-light)' }}>what they sell.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, lineHeight: 1.75, marginBottom: 36 }}>
          An independent adviser works differently — and that difference matters when you need to claim.
        </p>
      </div>

      <div ref={gridRef} style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14,
        transition: 'opacity 0.6s, transform 0.6s',
        opacity: gridInView ? 1 : 0,
        transform: gridInView ? 'none' : 'translateY(20px)',
      }}>
        {/* Bank column */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 16 }}>
            BANK / DIRECT INSURER
          </div>
          {BANK_ITEMS.map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 13.5, lineHeight: 1.55, alignItems: 'flex-start' }}>
              <CrossIcon />
              <span style={{ color: 'var(--muted)' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Adviser column */}
        <div style={{
          background: 'var(--green-dim)', border: '1px solid var(--green-border)',
          borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(45,179,122,0.4), transparent)',
          }} />
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--green-light)', marginBottom: 16 }}>
            INDEPENDENT ADVISER
          </div>
          {ADVISER_ITEMS.map(item => (
            <div key={item} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 13.5, lineHeight: 1.55, alignItems: 'flex-start' }}>
              <CheckIcon />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quote block */}
      <div ref={quoteRef} style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: '40px 36px', marginTop: 16,
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        transition: 'opacity 0.7s 0.1s, transform 0.7s 0.1s',
        opacity: quoteInView ? 1 : 0,
        transform: quoteInView ? 'none' : 'translateY(20px)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(45,179,122,0.2) 50%, transparent 100%)',
        }} />
        {/* Quote marks */}
        <div style={{
          fontSize: 80, lineHeight: 0.6, color: 'rgba(45,179,122,0.12)',
          fontFamily: 'Georgia, serif', marginBottom: 24, userSelect: 'none',
        }}>"</div>
        <div style={{
          fontSize: 'clamp(17px,2.8vw,23px)', fontWeight: 700,
          lineHeight: 1.45, letterSpacing: '-0.01em', marginBottom: 16,
        }}>
          Most people don't realise their cover has gaps{' '}
          <span style={{ color: 'var(--green-light)' }}>until they need to use it.</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--faint)' }}>
          A cover review takes 20 minutes. A declined claim can take months — and cost everything.
        </div>
      </div>
    </section>
  )
}
