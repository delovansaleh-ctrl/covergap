import { useState, useRef, useEffect, useCallback } from 'react'

const ENDPOINT = 'https://formsubmit.co/ajax/delovan.saleh@spireadvice.co.nz'

const PROVIDERS = [
  'ANZ / ASB / BNZ / Westpac',
  'AA Life Insurance',
  'SBS Insurance',
  'NZ Seniors / Momentum Life / OneChoice',
  'Another direct insurer',
  'Not sure',
]
const COVERS = [
  'Life insurance',
  'Trauma / critical illness cover',
  'Income protection',
  'Multiple of the above',
  'Not sure',
]

// ----- small sub-components -----

function ProgressDots({ step, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 44 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: i === step ? 22 : 7,
          height: 7,
          borderRadius: 4,
          background: i < step
            ? 'rgba(45,179,122,0.38)'
            : i === step
              ? 'var(--green)'
              : 'var(--border)',
          transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      ))}
    </div>
  )
}

function FieldInput({ label, id, type = 'text', placeholder, value, onChange, error, autoComplete }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.06em', color: focused ? 'var(--green-light)' : 'var(--muted)',
        marginBottom: 7, textTransform: 'uppercase',
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <input
        id={id} type={type} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: 'var(--bg)',
          border: `1.5px solid ${error ? '#FF7070' : focused ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 14, padding: '15px 18px',
          fontSize: 16, color: 'var(--text)',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(255,112,112,0.1)' : 'rgba(45,179,122,0.1)'}` : 'none',
        }}
      />
      {error && (
        <div style={{ fontSize: 12, color: '#FF7070', marginTop: 5 }}>{error}</div>
      )}
    </div>
  )
}

function FieldSelect({ label, id, options, value, onChange, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.06em',
        color: focused ? 'var(--green-light)' : 'var(--muted)',
        marginBottom: 7, textTransform: 'uppercase',
        transition: 'color 0.2s',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          id={id} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', appearance: 'none',
            background: 'var(--bg)',
            border: `1.5px solid ${error ? '#FF7070' : focused ? 'var(--green)' : 'var(--border)'}`,
            borderRadius: 14, padding: '15px 44px 15px 18px',
            fontSize: 16, color: value ? 'var(--text)' : 'rgba(242,245,243,0.25)',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(255,112,112,0.1)' : 'rgba(45,179,122,0.1)'}` : 'none',
          }}
        >
          <option value="" disabled>Select an option</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="rgba(242,245,243,0.3)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      {error && <div style={{ fontSize: 12, color: '#FF7070', marginTop: 5 }}>{error}</div>}
    </div>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--muted)', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  )
}

// ----- Step panels -----

function Step1({ data, setData, errors }) {
  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-light)', letterSpacing: '0.08em', marginBottom: 6 }}>STEP 1 OF 4</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 28, lineHeight: 1.2 }}>What's your name?</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <FieldInput label="First name" id="fname" placeholder="Sarah" value={data.fname} onChange={v => setData(p => ({ ...p, fname: v }))} error={errors.fname} autoComplete="given-name" />
        <FieldInput label="Last name" id="lname" placeholder="Thompson" value={data.lname} onChange={v => setData(p => ({ ...p, lname: v }))} error={errors.lname} autoComplete="family-name" />
      </div>
    </>
  )
}

function Step2({ data, setData, errors }) {
  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-light)', letterSpacing: '0.08em', marginBottom: 6 }}>STEP 2 OF 4</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 28, lineHeight: 1.2 }}>
        How should we reach you{data.fname ? `, ${data.fname}` : ''}?
      </div>
      <FieldInput label="Phone number" id="phone" type="tel" placeholder="021 000 0000" value={data.phone} onChange={v => setData(p => ({ ...p, phone: v }))} error={errors.phone} autoComplete="tel" />
      <FieldInput label="Email address" id="email" type="email" placeholder="sarah@email.com" value={data.email} onChange={v => setData(p => ({ ...p, email: v }))} error={errors.email} autoComplete="email" />
    </>
  )
}

function Step3({ data, setData, errors }) {
  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-light)', letterSpacing: '0.08em', marginBottom: 6 }}>STEP 3 OF 4</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 28, lineHeight: 1.2 }}>Tell us about your cover</div>
      <FieldSelect label="Where is your current insurance?" id="provider" options={PROVIDERS} value={data.provider} onChange={v => setData(p => ({ ...p, provider: v }))} error={errors.provider} />
      <FieldSelect label="What type of cover do you have?" id="cover" options={COVERS} value={data.cover} onChange={v => setData(p => ({ ...p, cover: v }))} error={errors.cover} />
    </>
  )
}

function Step4({ data, onBack, onSubmit, submitting }) {
  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-light)', letterSpacing: '0.08em', marginBottom: 6 }}>STEP 4 OF 4</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24, lineHeight: 1.2 }}>Does this look right?</div>
      <div style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '4px 20px 8px', marginBottom: 24,
      }}>
        <SummaryRow label="Name" value={`${data.fname} ${data.lname}`} />
        <SummaryRow label="Phone" value={data.phone} />
        <SummaryRow label="Email" value={data.email} />
        <SummaryRow label="Current insurer" value={data.provider} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--muted)', textTransform: 'uppercase' }}>Cover type</span>
          <span style={{ fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: '60%' }}>{data.cover}</span>
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={submitting}
        style={{
          width: '100%', background: submitting ? 'rgba(45,179,122,0.6)' : 'var(--green)',
          color: '#fff', border: 'none', borderRadius: 50, padding: '17px',
          fontSize: 16, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
          fontFamily: 'Inter, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'background 0.2s, transform 0.15s',
          boxShadow: '0 4px 20px rgba(45,179,122,0.25)',
        }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#25A06B' }}
        onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = 'var(--green)' }}
      >
        {submitting ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Submitting…
          </>
        ) : 'Submit my review request'}
      </button>
      <button
        onClick={onBack}
        style={{
          width: '100%', background: 'transparent',
          border: '1.5px solid var(--border)', color: 'var(--muted)',
          borderRadius: 50, padding: '14px', marginTop: 10,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
      >
        ← Edit my details
      </button>
      <p style={{ marginTop: 18, textAlign: 'center', fontSize: 12, color: 'var(--faint)', lineHeight: 1.7 }}>
        We'll call you within one business day. No obligation, no pressure.<br />
        Your information is kept private and never shared.
      </p>
    </>
  )
}

function SuccessState({ name }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 28px' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(45,179,122,0.12)',
          animation: 'pulse-ring 2s ease-out infinite',
        }} />
        <div style={{
          position: 'relative', width: 80, height: 80, borderRadius: '50%',
          background: 'var(--green-dim)', border: '1.5px solid var(--green-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="m8 12 3 3 5-6" stroke="#3DD68C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14 }}>
        We'll be in touch{name ? `, ${name}` : ''}.
      </h3>
      <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 360, margin: '0 auto' }}>
        Thanks for getting in touch. An adviser will call you within one business day to chat through your current cover and what a review looks like.
      </p>
    </div>
  )
}

// ----- Animated step wrapper -----
function AnimatedStep({ children, direction }) {
  const style = {
    animation: `${direction === 'forward' ? 'slideInRight' : 'slideInLeft'} 0.38s cubic-bezier(0.16,1,0.3,1) both`,
  }
  return (
    <>
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(28px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-28px) } to { opacity:1; transform:translateX(0) } }
      `}</style>
      <div style={style}>{children}</div>
    </>
  )
}

// ----- Main form -----
export default function MultiStepForm() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('forward')
  const [stepKey, setStepKey] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [data, setData] = useState({ fname: '', lname: '', phone: '', email: '', provider: '', cover: '' })
  const [errors, setErrors] = useState({})
  const sectionRef = useRef(null)

  const scrollToForm = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const validate = useCallback(() => {
    const errs = {}
    if (step === 0) {
      if (!data.fname.trim()) errs.fname = 'Please enter your first name.'
      if (!data.lname.trim()) errs.lname = 'Please enter your last name.'
    }
    if (step === 1) {
      if (!data.phone.trim()) errs.phone = 'Please enter a phone number.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Please enter a valid email address.'
    }
    if (step === 2) {
      if (!data.provider) errs.provider = 'Please select an option.'
      if (!data.cover) errs.cover = 'Please select an option.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }, [step, data])

  const goNext = () => {
    if (!validate()) return
    setDirection('forward')
    setStep(s => s + 1)
    setStepKey(k => k + 1)
    setTimeout(scrollToForm, 50)
  }

  const goBack = () => {
    setDirection('backward')
    setStep(s => s - 1)
    setStepKey(k => k + 1)
    setErrors({})
    setTimeout(scrollToForm, 50)
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: `${data.fname} ${data.lname}`,
          phone: data.phone,
          email: data.email,
          provider: data.provider,
          cover: data.cover,
          source: 'covergap.co.nz',
          _subject: `New cover review request — ${data.fname} ${data.lname}`,
        }),
      })
      if (res.ok) {
        setDone(true)
      } else {
        throw new Error('failed')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Enter key to advance
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && step < 3 && !done) {
        const active = document.activeElement?.tagName
        if (active !== 'SELECT') goNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [step, done, validate])

  return (
    <div id="review" ref={sectionRef} style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      scrollMarginTop: 60,
    }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '80px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>
            Request your{' '}
            <span style={{ color: 'var(--green-light)' }}>free review</span>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>We'll call you within one business day.</p>
        </div>

        {!done && <ProgressDots step={step} total={4} />}

        {/* Steps */}
        {done ? (
          <SuccessState name={data.fname} />
        ) : (
          <AnimatedStep key={stepKey} direction={direction}>
            {step === 0 && <Step1 data={data} setData={setData} errors={errors} />}
            {step === 1 && <Step2 data={data} setData={setData} errors={errors} />}
            {step === 2 && <Step3 data={data} setData={setData} errors={errors} />}
            {step === 3 && <Step4 data={data} onBack={goBack} onSubmit={submit} submitting={submitting} />}
          </AnimatedStep>
        )}

        {/* Nav buttons (steps 0–2) */}
        {!done && step < 3 && (
          <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center' }}>
            {step > 0 && (
              <button
                onClick={goBack}
                style={{
                  background: 'transparent', border: '1.5px solid var(--border)',
                  color: 'var(--muted)', borderRadius: 50, padding: '15px 22px',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={goNext}
              style={{
                flex: 1,
                background: 'var(--green)', color: '#fff', border: 'none',
                borderRadius: 50, padding: '16px',
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.2s, transform 0.15s',
                boxShadow: '0 4px 16px rgba(45,179,122,0.2)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#25A06B'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--green)'; e.currentTarget.style.transform = 'none' }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            >
              {step === 2 ? 'Review my details →' : 'Continue →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
