'use client'

import { useState, useEffect, useCallback } from 'react'
import { ClientBrief, BriefStatus, Booking } from '@/lib/types'
import { adminHeaders } from '@/lib/utils'
import BriefRow from './BriefRow'
import { useToast } from '@/components/Toast'

const STATUSES: BriefStatus[] = ['New', 'In Discussion', 'Quoted', 'Booked', 'Declined']
const COUNTRIES = ['United Kingdom', 'Ireland', 'Spain / Ibiza', 'Croatia', 'Netherlands', 'Belgium', 'Other']
const EVENT_TYPES = ['Music Festival', 'Club Night', 'Tour Date', 'Brand Activation', 'Award Show', 'Boat Party', 'Yacht Event', 'Other']

interface BookingModal {
  brief: ClientBrief
}

export default function BriefsTab() {
  const { addToast } = useToast()
  const [briefs, setBriefs] = useState<ClientBrief[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [country, setCountry] = useState('')
  const [eventType, setEventType] = useState('')
  const [bookingModal, setBookingModal] = useState<BookingModal | null>(null)
  const [bookingForm, setBookingForm] = useState<Partial<Booking>>({})
  const [savingBooking, setSavingBooking] = useState(false)

  const stats = {
    total: count,
    newCount: briefs.filter(b => b.status === 'New').length,
    inDiscussion: briefs.filter(b => b.status === 'In Discussion').length,
    booked: briefs.filter(b => b.status === 'Booked').length,
  }

  const fetchBriefs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (country) params.set('country', country)
      if (eventType) params.set('event_type', eventType)

      const res = await fetch(`/api/admin/briefs?${params}`, { headers: adminHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBriefs(data.data || [])
      setCount(data.count || 0)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load briefs', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, search, status, country, eventType, addToast])

  useEffect(() => { fetchBriefs() }, [fetchBriefs])

  function handleUpdate(id: string, updates: Partial<ClientBrief>) {
    setBriefs(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  function openBookingModal(brief: ClientBrief) {
    setBookingModal({ brief })
    setBookingForm({
      brief_id: brief.id,
      event_name: brief.event_name || '',
      event_date: brief.event_date || '',
      event_end_date: brief.event_end_date || '',
      location: brief.location || '',
      country: brief.country || '',
      client_name: brief.full_name,
      client_company: brief.company || '',
      client_email: brief.email,
      status: 'Confirmed',
    })
  }

  async function createBooking() {
    setSavingBooking(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: adminHeaders(),
        body: JSON.stringify(bookingForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await fetch(`/api/admin/briefs/${bookingModal!.brief.id}`, {
        method: 'PATCH',
        headers: adminHeaders(),
        body: JSON.stringify({ status: 'Booked' }),
      })
      handleUpdate(bookingModal!.brief.id, { status: 'Booked' })
      setBookingModal(null)
      addToast('Booking created successfully', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to create booking', 'error')
    } finally {
      setSavingBooking(false)
    }
  }

  const totalPages = Math.ceil(count / 25)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F5', marginBottom: '4px' }}>Client Briefs</h1>
        <p style={{ fontSize: '13px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>{count} briefs total</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '32px' }} className="stats-grid">
        <StatCard label="TOTAL BRIEFS" value={stats.total} />
        <StatCard label="NEW" value={stats.newCount} />
        <StatCard label="IN DISCUSSION" value={stats.inDiscussion} />
        <StatCard label="CONVERTED" value={stats.booked} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search name, company, event..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ flex: 1, minWidth: '200px', fontSize: '13px' }}
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={country} onChange={e => { setCountry(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">All countries</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={eventType} onChange={e => { setEventType(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">All event types</option>
          {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          className="btn-secondary"
          onClick={() => { setSearch(''); setStatus(''); setCountry(''); setEventType(''); setPage(1) }}
          style={{ fontSize: '11px', padding: '10px 16px' }}
        >
          CLEAR
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }} className="scrollbar-thin">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              {['Contact', 'Company', 'Event', 'Date', 'Location', 'Staff', 'Roles', 'Submitted', 'Status', ''].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center' }}>
                <span className="animate-pulse-accent" style={{ color: '#E8FF00', fontFamily: "'Syne Mono', monospace", fontSize: '12px' }}>LOADING...</span>
              </td></tr>
            ) : briefs.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '14px' }}>No briefs found</td></tr>
            ) : (
              briefs.map(brief => (
                <BriefRow
                  key={brief.id}
                  brief={brief}
                  onUpdate={handleUpdate}
                  onConvertToBooking={openBookingModal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ fontSize: '11px', padding: '8px 16px' }}>← PREVIOUS</button>
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: '11px', color: '#555' }}>{page} / {totalPages}</span>
          <button className="btn-secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ fontSize: '11px', padding: '8px 16px' }}>NEXT →</button>
        </div>
      )}

      {/* Booking modal */}
      {bookingModal && (
        <div
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '24px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setBookingModal(null) }}
        >
          <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F5', marginBottom: '24px' }}>Create Booking</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={modalLabelStyle}>Event Name</div>
                <input type="text" value={bookingForm.event_name || ''} onChange={e => setBookingForm(p => ({ ...p, event_name: e.target.value }))} style={{ fontSize: '13px' }} />
              </div>
              <div>
                <div style={modalLabelStyle}>Client Name</div>
                <input type="text" value={bookingForm.client_name || ''} onChange={e => setBookingForm(p => ({ ...p, client_name: e.target.value }))} style={{ fontSize: '13px' }} />
              </div>
              <div>
                <div style={modalLabelStyle}>Event Date</div>
                <input type="date" value={bookingForm.event_date || ''} onChange={e => setBookingForm(p => ({ ...p, event_date: e.target.value }))} style={{ fontSize: '13px', colorScheme: 'dark' }} />
              </div>
              <div>
                <div style={modalLabelStyle}>Location</div>
                <input type="text" value={bookingForm.location || ''} onChange={e => setBookingForm(p => ({ ...p, location: e.target.value }))} style={{ fontSize: '13px' }} />
              </div>
              <div>
                <div style={modalLabelStyle}>Invoice Value (£)</div>
                <input type="number" value={bookingForm.total_invoice_value || ''} onChange={e => setBookingForm(p => ({ ...p, total_invoice_value: parseFloat(e.target.value) || 0 }))} style={{ fontSize: '13px' }} />
              </div>
              <div>
                <div style={modalLabelStyle}>Worker Cost (£)</div>
                <input type="number" value={bookingForm.worker_cost || ''} onChange={e => setBookingForm(p => ({ ...p, worker_cost: parseFloat(e.target.value) || 0 }))} style={{ fontSize: '13px' }} />
              </div>
              <div>
                <div style={modalLabelStyle}>Deposit Amount (£)</div>
                <input type="number" value={bookingForm.deposit_amount || ''} onChange={e => setBookingForm(p => ({ ...p, deposit_amount: parseFloat(e.target.value) || 0 }))} style={{ fontSize: '13px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-primary" onClick={createBooking} disabled={savingBooking} style={{ flex: 1, fontSize: '11px' }}>
                {savingBooking ? 'CREATING...' : 'CREATE BOOKING'}
              </button>
              <button className="btn-secondary" onClick={() => setBookingModal(null)} style={{ fontSize: '11px', padding: '14px 24px' }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontFamily: "'Syne Mono', monospace",
  fontSize: '10px',
  letterSpacing: '2px',
  color: '#555',
  fontWeight: 400,
}

const modalLabelStyle: React.CSSProperties = {
  fontFamily: "'Syne Mono', monospace",
  fontSize: '10px',
  letterSpacing: '2px',
  color: '#555',
  marginBottom: '6px',
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '32px', color: '#E8FF00', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '2px' }}>{label}</div>
    </div>
  )
}
