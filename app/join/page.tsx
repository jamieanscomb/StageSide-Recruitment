'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useToast } from '@/components/Toast'

const MARKETS = ['UK', 'Ireland', 'Ibiza / Spain', 'Croatia', 'Netherlands', 'Belgium']
const ROLES = [
  'Bar Staff', 'Stagehand / Crew', 'Steward / Crowd Management',
  'Merch / Box Office', 'Runner / Production Assistant', 'Supervisor / Team Lead',
  'Brand Ambassador', 'VIP Host', 'Other',
]
const EXPERIENCE_OPTIONS = ['Less than 1 year', '1-3 years', '3-5 years', '5+ years']
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Full weeks', 'Flexible']
const COUNTRIES = ['United Kingdom', 'Ireland', 'Spain', 'Croatia', 'Netherlands', 'Belgium', 'Other']

interface FormState {
  full_name: string
  email: string
  phone: string
  city: string
  country: string
  markets: string[]
  roles: string[]
  experience: string
  events_worked: string
  availability: string[]
  international: string
  languages: string
  right_to_work_uk: string
  right_to_work_eu: string
  heard_from: string
  cv: File | null
}

type Errors = Partial<Record<keyof FormState, string>>

const initial: FormState = {
  full_name: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  markets: [],
  roles: [],
  experience: '',
  events_worked: '',
  availability: [],
  international: '',
  languages: '',
  right_to_work_uk: '',
  right_to_work_eu: '',
  heard_from: '',
  cv: null,
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

function ErrorMsg({ children }: { children: string }) {
  return (
    <p style={{ color: '#FF3D3D', fontSize: '12px', marginTop: '6px', fontFamily: "'Space Grotesk', sans-serif" }}>
      {children}
    </p>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: '20px',
        color: '#F5F5F5',
        marginBottom: '24px',
        paddingTop: '40px',
        borderTop: '1px solid #222',
      }}
    >
      {children}
    </h3>
  )
}

export default function JoinPage() {
  const { addToast } = useToast()
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.country) e.country = 'Country is required'
    if (form.markets.length === 0) e.markets = 'Select at least one market'
    if (form.roles.length === 0) e.roles = 'Select at least one role'
    if (!form.experience) e.experience = 'Select your experience level'
    if (form.availability.length === 0) e.availability = 'Select at least one availability option'
    if (!form.international) e.international = 'Please select an option'
    if (!form.right_to_work_uk) e.right_to_work_uk = 'Please select an option'
    if (!form.right_to_work_eu) e.right_to_work_eu = 'Please select an option'
    if (form.cv && form.cv.size > 5 * 1024 * 1024) e.cv = 'CV must be under 5MB'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (val === null) return
        if (val instanceof File) {
          fd.append('cv', val)
        } else if (Array.isArray(val)) {
          fd.append(key, JSON.stringify(val))
        } else {
          fd.append(key, String(val))
        }
      })
      const res = await fetch('/api/submit-worker', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
      addToast('Application received. We\'ll review it within 5 working days and be in touch.', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '120px 24px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
                color: '#E8FF00',
                marginBottom: '12px',
              }}
            >
              Application received.
            </p>
            <p style={{ color: '#555', fontSize: '16px' }}>
              We&apos;ll review it within 5 working days and be in touch.
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: '140px 24px 80px', maxWidth: '720px', margin: '0 auto' }}>
        <span className="section-eyebrow">JOIN OUR ROSTER</span>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '42px',
            color: '#F5F5F5',
            letterSpacing: '-1px',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}
          className="join-headline"
        >
          Be part of the music industry&apos;s best staffing network.
        </h1>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.6, marginBottom: '48px' }}>
          We place workers across festivals, clubs, tours, and events in the UK, Ireland, Ibiza, Croatia, Netherlands and Belgium. If you&apos;re reliable, vetted, and passionate about music — we want to hear from you.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* About You */}
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '20px',
              color: '#F5F5F5',
              marginBottom: '24px',
            }}
          >
            About You
          </h3>

          <div className="form-grid">
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={form.full_name}
                onChange={e => setField('full_name', e.target.value)}
              />
              {errors.full_name && <ErrorMsg>{errors.full_name}</ErrorMsg>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
              />
              {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={e => setField('phone', e.target.value)}
              />
              {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={e => setField('city', e.target.value)}
              />
              {errors.city && <ErrorMsg>{errors.city}</ErrorMsg>}
            </div>
            <div className="col-span-2">
              <select
                value={form.country}
                onChange={e => setField('country', e.target.value)}
              >
                <option value="">Country</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <ErrorMsg>{errors.country}</ErrorMsg>}
            </div>
          </div>

          <SectionHeading>Your Experience</SectionHeading>

          {/* Markets */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              WHICH MARKETS CAN YOU WORK IN?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {MARKETS.map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.markets.includes(m)}
                    onChange={() => setField('markets', toggle(form.markets, m))}
                  />
                  <span style={{ fontSize: '14px', color: '#D0D0D0' }}>{m}</span>
                </label>
              ))}
            </div>
            {errors.markets && <ErrorMsg>{errors.markets}</ErrorMsg>}
          </div>

          {/* Roles */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              ROLES YOU CAN PERFORM
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {ROLES.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.roles.includes(r)}
                    onChange={() => setField('roles', toggle(form.roles, r))}
                  />
                  <span style={{ fontSize: '14px', color: '#D0D0D0' }}>{r}</span>
                </label>
              ))}
            </div>
            {errors.roles && <ErrorMsg>{errors.roles}</ErrorMsg>}
          </div>

          {/* Experience */}
          <div style={{ marginBottom: '24px' }}>
            <select
              value={form.experience}
              onChange={e => setField('experience', e.target.value)}
            >
              <option value="">Years of experience in events</option>
              {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.experience && <ErrorMsg>{errors.experience}</ErrorMsg>}
          </div>

          {/* Events worked */}
          <div style={{ marginBottom: '24px' }}>
            <textarea
              placeholder="Events you have previously worked — list the event names and your role"
              value={form.events_worked}
              onChange={e => setField('events_worked', e.target.value)}
              rows={4}
            />
          </div>

          {/* Availability */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              YOUR AVAILABILITY
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {AVAILABILITY_OPTIONS.map(a => (
                <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.availability.includes(a)}
                    onChange={() => setField('availability', toggle(form.availability, a))}
                  />
                  <span style={{ fontSize: '14px', color: '#D0D0D0' }}>{a}</span>
                </label>
              ))}
            </div>
            {errors.availability && <ErrorMsg>{errors.availability}</ErrorMsg>}
          </div>

          {/* International */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              WILL YOU TRAVEL INTERNATIONALLY FOR WORK?
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Yes', 'No', 'Sometimes'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="international"
                    value={opt}
                    checked={form.international === opt}
                    onChange={() => setField('international', opt)}
                  />
                  <span style={{ fontSize: '14px', color: '#D0D0D0' }}>{opt}</span>
                </label>
              ))}
            </div>
            {errors.international && <ErrorMsg>{errors.international}</ErrorMsg>}
          </div>

          {/* Languages */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Languages spoken (optional)"
              value={form.languages}
              onChange={e => setField('languages', e.target.value)}
            />
          </div>

          <SectionHeading>Eligibility</SectionHeading>

          {/* Right to work UK */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              DO YOU HAVE THE RIGHT TO WORK IN THE UK?
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Yes', 'No', 'Not applicable'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="right_to_work_uk"
                    value={opt}
                    checked={form.right_to_work_uk === opt}
                    onChange={() => setField('right_to_work_uk', opt)}
                  />
                  <span style={{ fontSize: '14px', color: '#D0D0D0' }}>{opt}</span>
                </label>
              ))}
            </div>
            {errors.right_to_work_uk && <ErrorMsg>{errors.right_to_work_uk}</ErrorMsg>}
          </div>

          {/* Right to work EU */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              DO YOU HAVE THE RIGHT TO WORK IN THE EU?
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Yes', 'No', 'Not sure'].map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="right_to_work_eu"
                    value={opt}
                    checked={form.right_to_work_eu === opt}
                    onChange={() => setField('right_to_work_eu', opt)}
                  />
                  <span style={{ fontSize: '14px', color: '#D0D0D0' }}>{opt}</span>
                </label>
              ))}
            </div>
            {errors.right_to_work_eu && <ErrorMsg>{errors.right_to_work_eu}</ErrorMsg>}
          </div>

          <SectionHeading>One More Thing</SectionHeading>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="How did you hear about Stageside? (optional)"
              value={form.heard_from}
              onChange={e => setField('heard_from', e.target.value)}
            />
          </div>

          {/* CV upload */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
              UPLOAD YOUR CV (OPTIONAL — PDF OR WORD, MAX 5MB)
            </div>
            <div
              style={{
                border: '1px solid #222',
                backgroundColor: '#1A1A1A',
                padding: '14px 16px',
                position: 'relative',
              }}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0] || null
                  setField('cv', f)
                  if (errors.cv) setErrors(prev => ({ ...prev, cv: undefined }))
                }}
                style={{ color: '#D0D0D0', fontSize: '14px', padding: 0, border: 'none', backgroundColor: 'transparent' }}
              />
            </div>
            {form.cv && (
              <p style={{ fontSize: '12px', color: '#4DFF91', marginTop: '6px' }}>
                {form.cv.name} ({(form.cv.size / 1024 / 1024).toFixed(1)}MB)
              </p>
            )}
            {errors.cv && <ErrorMsg>{errors.cv}</ErrorMsg>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? <span className="animate-pulse-accent">SUBMITTING...</span> : 'SUBMIT APPLICATION'}
          </button>
        </form>
      </div>

      <Footer />

      <style jsx global>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .col-span-2 { grid-column: span 2; }
        .join-headline { font-size: 42px; }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
          .col-span-2 { grid-column: span 1 !important; }
          .join-headline { font-size: 32px !important; }
        }
      `}</style>
    </>
  )
}
