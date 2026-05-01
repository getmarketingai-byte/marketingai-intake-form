'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import type { CSSProperties } from 'react'

interface FormValues {
  email: string
  companyName: string
  industry: string
  challenge: string
  linkedinActivity: string
  budgetRange: string
  preferredTime: string
}

const INITIAL: FormValues = {
  email: '',
  companyName: '',
  industry: '',
  challenge: '',
  linkedinActivity: '',
  budgetRange: '',
  preferredTime: '',
}

export default function IntakeForm() {
  const [form, setForm] = useState<FormValues>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function set(field: keyof FormValues) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.linkedinActivity) {
      setError('Please select your LinkedIn activity level.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error || 'Submission failed.')
      }
      setSubmitted(true)
      setTimeout(() => { window.location.href = 'https://calendly.com/getmarketingai/30min' }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main style={s.main}>
        <div style={s.card}>
          <div style={s.successIcon}>&#10003;</div>
          <h2 style={s.successTitle}>You&apos;re all set!</h2>
          <p style={s.successText}>Thanks for filling in your details. We&apos;ll review everything before our call so we can hit the ground running.</p>
          <p style={s.redirectNote}>Taking you to book your call now...</p>
          <a href="https://calendly.com/getmarketingai/30min" style={s.calendlyBtn}>Book Your Strategy Call</a>
        </div>
      </main>
    )
  }

  return (
    <main style={s.main}>
      <div style={s.card}>
        <div style={s.header}>
          <p style={s.logo}>MarketingAI</p>
          <h1 style={s.title}>Pre-Call Intake Form</h1>
          <p style={s.subtitle}>Help us prepare for your discovery call - takes under 2 minutes.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div style={s.field}>
            <label style={s.label} htmlFor="email">Work Email <span style={s.req}>*</span></label>
            <input id="email" type="email" value={form.email} onChange={set('email')} required placeholder="you@company.com" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="companyName">Company / Business Name <span style={s.req}>*</span></label>
            <input id="companyName" type="text" value={form.companyName} onChange={set('companyName')} required placeholder="Your business name" style={s.input} />
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="industry">Industry / Business Type <span style={s.req}>*</span></label>
            <select id="industry" value={form.industry} onChange={set('industry')} required style={s.select}>
              <option value="">Select your industry</option>
              <option value="Mortgage Broker / Finance">Mortgage Broker / Finance</option>
              <option value="Coach / Consultant">Coach / Consultant</option>
              <option value="Migration Agent / Immigration">Migration Agent / Immigration</option>
              <option value="Allied Health / Medical">Allied Health / Medical</option>
              <option value="Tradie / Trade Services">Tradie / Trade Services</option>
              <option value="Real Estate">Real Estate</option>
              <option value="eCommerce / Retail">eCommerce / Retail</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="challenge">Biggest Marketing Challenge <span style={s.req}>*</span></label>
            <textarea id="challenge" value={form.challenge} onChange={set('challenge')} required rows={3} placeholder="e.g. Not getting enough leads, no time for content..." style={s.textarea} />
          </div>
          <div style={s.field}>
            <p style={s.label}>Current LinkedIn Activity <span style={s.req}>*</span></p>
            <div style={s.radioGroup}>
              {[
                { value: 'None', label: 'None - not active at all' },
                { value: 'Some', label: 'Some - occasional posts' },
                { value: 'Active', label: 'Active - posting regularly' },
              ].map(opt => (
                <label key={opt.value} style={s.radioLabel}>
                  <input type="radio" name="linkedinActivity" value={opt.value} checked={form.linkedinActivity === opt.value} onChange={set('linkedinActivity')} style={s.radioInput} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="budgetRange">Monthly Marketing Budget <span style={s.opt}>(optional)</span></label>
            <select id="budgetRange" value={form.budgetRange} onChange={set('budgetRange')} style={s.select}>
              <option value="">Prefer not to say</option>
              <option value="$0-$2,000">$0 - $2,000</option>
              <option value="$2,000-$5,000">$2,000 - $5,000</option>
              <option value="$5,000-$10,000">$5,000 - $10,000</option>
              <option value="$10,000+">$10,000+</option>
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label} htmlFor="preferredTime">Preferred Meeting Time <span style={s.opt}>(optional)</span></label>
            <input id="preferredTime" type="datetime-local" value={form.preferredTime} onChange={set('preferredTime')} style={s.input} />
          </div>
          {error && <p style={s.errorMsg}>{error}</p>}
          <button type="submit" disabled={submitting} style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Sending...' : 'Submit and Book My Call'}
          </button>
          <p style={s.disclaimer}>By submitting you agree to receive emails from MarketingAI. Unsubscribe any time. Results are indicative only.</p>
        </form>
      </div>
    </main>
  )
}

const s: Record<string, CSSProperties> = {
  main: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1a2e 60%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' },
  card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', maxWidth: '560px', width: '100%' },
  header: { marginBottom: '32px', textAlign: 'center' },
  logo: { fontWeight: 700, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', color: '#e94560' },
  title: { color: '#ffffff', fontSize: '26px', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.25 },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: 0, lineHeight: 1.5 },
  field: { marginBottom: '20px' },
  label: { display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' },
  req: { color: '#e94560', marginLeft: '2px' },
  opt: { color: 'rgba(255,255,255,0.3)', fontWeight: 400, fontSize: '12px', marginLeft: '4px' },
  input: { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', color: '#ffffff', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', color: '#ffffff', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' },
  select: { width: '100%', background: 'rgba(20,15,45,0.95)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', color: '#ffffff', fontSize: '15px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  radioGroup: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.75)', fontSize: '14px', cursor: 'pointer' },
  radioInput: { accentColor: '#e94560', width: '16px', height: '16px', flexShrink: 0 },
  submitBtn: { width: '100%', background: 'linear-gradient(90deg, #e94560, #8b5cf6)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '14px 24px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit' },
  errorMsg: { color: '#f87171', fontSize: '14px', marginBottom: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '10px 14px' },
  disclaimer: { color: 'rgba(255,255,255,0.28)', fontSize: '11px', textAlign: 'center', marginTop: '14px', lineHeight: 1.5 },
  successIcon: { width: '56px', height: '56px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: '#fff', margin: '0 auto 20px' },
  successTitle: { color: '#ffffff', fontSize: '24px', fontWeight: 700, textAlign: 'center', margin: '0 0 12px' },
  successText: { color: 'rgba(255,255,255,0.6)', fontSize: '15px', textAlign: 'center', lineHeight: 1.6, margin: '0 0 16px' },
  redirectNote: { color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center', margin: '0 0 20px' },
  calendlyBtn: { display: 'block', background: 'linear-gradient(90deg, #e94560, #8b5cf6)', color: '#ffffff', borderRadius: '8px', padding: '14px 24px', fontSize: '16px', fontWeight: 600, textAlign: 'center', textDecoration: 'none' },
}
