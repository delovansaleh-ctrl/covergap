import { useInView } from './useInView'

const CARDS = [
  {
    tag: 'BANK / DIRECT COVER',
    tagColor: { bg: 'rgba(255,140,60,0.1)', color: '#FF9A50', border: 'rgba(255,140,60,0.2)' },
    title: 'Got your insurance through a bank or direct insurer?',
    body: 'Bank and direct policies are standardised products. They\'re quick to set up, but they can\'t assess your specific health, income, or family situation — which means the cover may not fit as well as you think.',
    icon: '🏦',
    delay: 0,
  },
  {
    tag: 'NON-UNDERWRITTEN COVER',
    tagColor: { bg: 'rgba(74,156,222,0.1)', color: '#5AADEE', border: 'rgba(74,156,222,0.2)' },
    title: 'Got cover without a medical assessment?',
    body: 'Non-underwritten policies pool risk across everyone. Without looking at your individual situation, they often charge more than necessary — or exclude things you\'d expect to be covered when you need to claim.',
    icon: '📋',
    delay: 100,
  },
  {
    tag: 'NOT SURE',
    tagColor: { bg: 'rgba(255,140,60,0.1)', color: '#FF9A50', border: 'rgba(255,140,60,0.2)' },
    title: 'Can\'t remember how you set it up?',
    body: 'That\'s more common than you\'d think. If it\'s been a few years since you looked at your cover, a review is worth 20 minutes of your time. A lot can change — and so can better options.',
    icon: '🤔',
    delay: 200,
  },
]

function Card({ card }) {
  const [ref, inView] = useInView()

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 28,
        transition: `opacity 0.6s ease ${card.delay}ms, transform 0.6s ease ${card.delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        cursor: 'default',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Subtle top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: 20, right: 20, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(45,179,122,0.15), transparent)',
      }} />
      <div style={{
        display: 'inline-block', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 20,
        marginBottom: 16,
        background: card.tagColor.bg,
        color: card.tagColor.color,
        border: `1px solid ${card.tagColor.border}`,
      }}>
        {card.tag}
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, lineHeight: 1.4 }}>{card.title}</h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{card.body}</p>
    </div>
  )
}

export default function WhoIsThisFor() {
  const [headRef, headInView] = useInView()

  return (
    <section style={{ padding: '80px 24px', maxWidth: 960, margin: '0 auto' }}>
      <div ref={headRef} style={{
        transition: 'opacity 0.6s, transform 0.6s',
        opacity: headInView ? 1 : 0,
        transform: headInView ? 'none' : 'translateY(20px)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--green-light)', marginBottom: 14 }}>
          WHO THIS IS FOR
        </div>
        <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
          You already have insurance.<br />
          <span style={{ color: 'var(--green-light)' }}>This is about what it actually covers.</span>
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, lineHeight: 1.75, marginBottom: 40 }}>
          A cover review isn't about getting a new policy. It's about understanding whether the one you have is doing its job.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 16 }}>
        {CARDS.map(card => <Card key={card.tag} card={card} />)}
      </div>
    </section>
  )
}
