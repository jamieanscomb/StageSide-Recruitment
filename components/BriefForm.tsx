'use client'

import { useState, FormEvent } from 'react'
import { useToast } from './Toast'
import { BriefFormData } from '@/lib/types'

const EVENT_TYPES = [
  'Music Festival', 'Club Night', 'Tour Date', 'Brand Activation',
  'Award Show', 'Boat Party', 'Yacht Event', 'Other',
]

const COUNTRIES = [
  'United Kingdom', 'Ireland', 'Spain / Ibiza', 'Croatia',
  'Netherlands', 'Belgium', 'Other',
]

const STAFF_COUNTS = ['1-5', '6-15', '16-30', '31-50', '50+']

const ROLES = [
  'Bar Staff', 'Stagehand', 'Steward', 'Merch', 'Runner',
  'Supervisor', 'Brand Ambassador', 'Production Assistant', 'VIP Host', 'Other',
]

const BUDGETS = [
  'Under £2,000', '£2,000–£5,000', '£5,000–£15,000',
  '£15,000–£30,000', '£30,000+', 'Prefer not to say',
]

type Errors = Partial<Record<keyof BriefFormData, string>>

const initialForm: BriefFormData = {
  full_name: '',
  company: '',
  email: '',
  phone: '',
  event_name: '',
  event_type: '',
  event_date: '',
  event_end_date: '',
  location: '',
  country: '',
  staff_count: '',
  roles: [],
  budget: '',
  information: '',
  deposit_agreed: false,
}

export default function BriefForm() {
  const { addToast } = useToast()
  const [form, setForm] = useState<BriefFormData>(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const e: Errors = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.company.trim()) e.company = 'Company name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.event_name.trim()) e.event_name = 'Event name is required'
    if (!form.event_type) e.event_type = 'Event type is required'
    if (!form.event_date) e.event_date = 'Event date is required'
    if (!form.location.trim()) e.location = 'Location is required'
    if (!form.country) e.country = 'Country is required'
    if (!form.staff_count) e.staff_count = 'Staff count is required'
    if (form.roles.length === 0) e.roles = 'Select at least one role'
    if (!form.budget) e.budget = 'Budget is required'
    if (!form.deposit_agreed) e.deposit_agreed = 'You must agree to the deposit terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function setField<K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function toggleRole(role: string) {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }))
    if (errors.roles) setErrors(prev => ({ ...prev, roles: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/api/submit-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
      addToast('Brief received. We\'ll be in touch within 24 hours.', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '20px',
            fontWeight: 700,
            color: '#E8FF00',
          }}
        >
          Brief received. We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-cols-brief">
        <div>
          <input
            type="text"
            placeholder="Full name"
            value={form.full_name}
            onChange={e => setField('full_name', e.target.value)}
            aria-label="Full name"
          />
          {errors.full_name && <ErrorMsg>{errors.full_name}</ErrorMsg>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Company name"
            value={form.company}
            onChange={e => setField('company', e.target.value)}
            aria-label="Company name"
          />
          {errors.company && <ErrorMsg>{errors.company}</ErrorMsg>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={e => setField('email', e.target.value)}
            aria-label="Email"
          />
          {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={e => setField('phone', e.target.value)}
            aria-label="Phone"
          />
          {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Event name"
            value={form.event_name}
            onChange={e => setField('event_name', e.target.value)}
            aria-label="Event name"
          />
          {errors.event_name && <ErrorMsg>{errors.event_name}</ErrorMsg>}
        </div>
        <div>
          <select
            value={form.event_type}
            onChange={e => setField('event_type', e.target.value)}
            aria-label="Event type"
          >
            <option value="">Event type</option>
            {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.event_type && <ErrorMsg>{errors.event_type}</ErrorMsg>}
        </div>
        <div>
          <input
            type="date"
            value={form.event_date}
            onChange={e => setField('event_date', e.target.value)}
            aria-label="Event date"
            style={{ colorScheme: 'dark' }}
          />
          {errors.event_date && <ErrorMsg>{errors.event_date}</ErrorMsg>}
        </div>
        <div>
          <input
            type="date"
            value={form.event_end_date}
            onChange={e => setField('event_end_date', e.target.value)}
            aria-label="Event end date (optional)"
            placeholder="Event end date (optional)"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Event location — city"
            value={form.location}
            onChange={e => setField('location', e.target.value)}
            aria-label="Location"
          />
          {errors.location && <ErrorMsg>{errors.location}</ErrorMsg>}
        </div>
        <div>
          <select
            value={form.country}
            onChange={e => setField('country', e.target.value)}
            aria-label="Country"
          >
            <option value="">Country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.country && <ErrorMsg>{errors.country}</ErrorMsg>}
        </div>
        <div>
          <select
            value={form.staff_count}
            onChange={e => setField('staff_count', e.target.value)}
            aria-label="Staff count"
          >
            <option value="">Approximate staff needed</option>
            {STAFF_COUNTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.staff_count && <ErrorMsg>{errors.staff_count}</ErrorMsg>}
        </div>
        <div>
          <select
            value={form.budget}
            onChange={e => setField('budget', e.target.value)}
            aria-label="Budget"
          >
            <option value="">Approximate budget</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {errors.budget && <ErrorMsg>{errors.budget}</ErrorMsg>}
        </div>
      </div>

      {/* Roles */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '12px', color: '#555', fontSize: '12px', fontFamily: "'Syne Mono', monospace", letterSpacing: '2px' }}>
          ROLES NEEDED
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {ROLES.map(role => (
            <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.roles.includes(role)}
                onChange={() => toggleRole(role)}
              />
              <span style={{ fontSize: '14px', color: '#D0D0D0', fontFamily: "'Space Grotesk', sans-serif" }}>
                {role}
              </span>
            </label>
          ))}
        </div>
        {errors.roles && <ErrorMsg>{errors.roles}</ErrorMsg>}
      </div>

      {/* Additional info */}
      <div style={{ marginTop: '16px' }}>
        <textarea
          placeholder="Additional information (optional)"
          value={form.information}
          onChange={e => setField('information', e.target.value)}
          rows={4}
          aria-label="Additional information"
        />
      </div>

      {/* Deposit checkbox */}
      <div style={{ marginTop: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.deposit_agreed}
            onChange={e => setField('deposit_agreed', e.target.checked)}
            style={{ marginTop: '2px' }}
          />
          <span style={{ fontSize: '14px', color: '#D0D0D0', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>
            I understand a 50% deposit is required to confirm a booking
          </span>
        </label>
        {errors.deposit_agreed && <ErrorMsg>{errors.deposit_agreed}</ErrorMsg>}
      </div>

      <div style={{ marginTop: '32px' }}>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? (
            <span className="animate-pulse-accent">SUBMITTING...</span>
          ) : (
            'SUBMIT BRIEF'
          )}
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .grid-cols-brief {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </form>
  )
}

function ErrorMsg({ children }: { children: string }) {
  return (
    <p
      style={{
        color: '#FF3D3D',
        fontSize: '12px',
        fontFamily: "'Space Grotesk', sans-serif",
        marginTop: '6px',
      }}
    >
      {children}
    </p>
  )
}
