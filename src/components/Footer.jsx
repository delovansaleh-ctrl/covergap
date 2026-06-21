export default function Footer() {
  return (
    <footer style={{ padding: '48px 24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
        cover<span style={{ color: 'var(--green-light)' }}>gap</span>
      </div>
      <p style={{
        fontSize: 12, color: 'var(--faint)',
        maxWidth: 600, margin: '0 auto', lineHeight: 1.85,
      }}>
        CoverGap is a trading name operated by{' '}
        <strong style={{ color: 'rgba(242,245,243,0.45)' }}>Spire Advice Limited</strong>, a Financial Advice Provider
        registered on the Financial Service Providers Register (FSP number:{' '}
        <strong style={{ color: 'rgba(242,245,243,0.45)' }}>FSP1011463</strong>).{' '}
        Spire Advice Limited is bound by the Code of Professional Conduct for Financial Advice Services.
        Our advisers receive commission from insurance providers when a policy is placed — this is how the service
        remains at no cost to you. A full disclosure statement is available on request and will be provided before
        any advice is given.
      </p>
      <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(242,245,243,0.14)' }}>
        © {new Date().getFullYear()} Spire Advice Limited. All rights reserved.
      </p>
    </footer>
  )
}
