const ITEMS = [
  {
    label: 'Access to NZ\'s top insurers',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2DB37A" strokeWidth="1.8"/><path d="m9 12 2 2 4-4" stroke="#2DB37A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: 'Not a quote comparison',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#2DB37A" strokeWidth="1.8"/><path d="m9 12 2 2 4-4" stroke="#2DB37A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    label: 'FSP registered adviser',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#2DB37A" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#2DB37A" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    label: 'At no cost to you',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#2DB37A" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
]

export default function TrustBar() {
  return (
    <div style={{
      padding: '22px 24px',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', justifyContent: 'center',
      gap: 'clamp(20px,4vw,56px)', flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.015)',
    }}>
      {ITEMS.map(({ label, icon }) => (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 13, color: 'var(--muted)',
        }}>
          {icon}
          {label}
        </div>
      ))}
    </div>
  )
}
