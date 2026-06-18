'use client'

import { useState, useEffect, useCallback } from 'react'
import { Booking } from '@/lib/types'
import { adminHeaders, formatCurrency } from '@/lib/utils'
import BookingRow from './BookingRow'
import { useToast } from '@/components/Toast'

export default function BookingsTab() {
  const { addToast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({ status: 'Confirmed' })
  const [saving, setSaving] = useState(false)

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_invoice_value || 0), 0)
  const totalMargin = bookings.reduce((s, b) => s + (b.margin || 0), 0)
  const unpaid = bookings.filter(b => !b.invoice_paid).length

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings?page=${page}`, { headers: adminHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBookings(data.data || [])
      setCount(data.count || 0)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load bookings', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, addToast])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  function handleUpdate(id: string, updates: Partial<Booking>) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  async function handleAddBooking() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: adminHeaders(),
        body: JSON.stringify(newBooking),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setShowAddModal(false)
      setNewBooking({ status: 'Confirmed' })
      fetchBookings()
      addToast('Booking created', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to create booking', 'error')
    } finally {
      setSaving(false)
    }
  }

  const totalPages = Math.ceil(count / 25)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F5', marginBottom: '4px' }}>Bookings</h1>
          <p style={{ fontSize: '13px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>{count} bookings total</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ fontSize: '11px' }}>+ ADD BOOKING</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '32px' }} className="stats-grid">
        <StatCard label="TOTAL BOOKINGS" value={String(count)} />
        <StatCard label="TOTAL REVENUE" value={formatCurrency(totalRevenue)} />
        <StatCard label="TOTAL MARGIN" value={formatCurrency(totalMargin)} />
        <StatCard label="UNPAID INVOICES" value={String(unpaid)} />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }} className="scrollbar-thin">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              {['Event', 'Client', 'Date', 'Location', 'Workers', 'Invoice Value', 'Worker Cost', 'Margin', 'Deposit', 'Inv Sent', 'Inv Paid', 'Status', ''].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={13} style={{ padding: '40px', textAlign: 'center' }}>
                <span className="animate-pulse-accent" style={{ color: '#E8FF00', fontFamily: "'Syne Mono', monospace", fontSize: '12px' }}>LOADING...</span>
              </td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={13} style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '14px' }}>No bookings yet</td></tr>
            ) : (
              bookings.map(booking => (
                <BookingRow key={booking.id} booking={booking} onUpdate={handleUpdate} />
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

      {/* Add Booking Modal */}
      {showAddModal && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false) }}
        >
          <div style={{ backgroundColor: '#111', border: '1px solid #333', padding: '32px', width: '100%', maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#F5F5F5', marginBottom: '24px' }}>Add Booking</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              {[
                { label: 'Event Name', field: 'event_name', type: 'text' },
                { label: 'Client Name', field: 'client_name', type: 'text' },
                { label: 'Client Company', field: 'client_company', type: 'text' },
                { label: 'Client Email', field: 'client_email', type: 'email' },
                { label: 'Event Date', field: 'event_date', type: 'date' },
                { label: 'End Date', field: 'event_end_date', type: 'date' },
                { label: 'Location', field: 'location', type: 'text' },
                { label: 'Country', field: 'country', type: 'text' },
                { label: 'Invoice Value (£)', field: 'total_invoice_value', type: 'number' },
                { label: 'Worker Cost (£)', field: 'worker_cost', type: 'number' },
                { label: 'Deposit Amount (£)', field: 'deposit_amount', type: 'number' },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <div style={modalLabelStyle}>{label.toUpperCase()}</div>
                  <input
                    type={type}
                    value={(newBooking as Record<string, unknown>)[field] as string || ''}
                    onChange={e => setNewBooking(p => ({ ...p, [field]: type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    style={{ fontSize: '13px', colorScheme: type === 'date' ? 'dark' : 'normal' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-primary" onClick={handleAddBooking} disabled={saving} style={{ flex: 1, fontSize: '11px' }}>
                {saving ? 'CREATING...' : 'CREATE BOOKING'}
              </button>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)} style={{ fontSize: '11px', padding: '14px 24px' }}>CANCEL</button>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ backgroundColor: '#111', border: '1px solid #222', padding: '20px 24px' }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '28px', color: '#E8FF00', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '2px' }}>{label}</div>
    </div>
  )
}
