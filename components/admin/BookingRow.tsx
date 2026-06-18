'use client'

import { useState } from 'react'
import { Booking, BookingStatus } from '@/lib/types'
import { formatDate, formatCurrency, adminHeaders } from '@/lib/utils'
import { useToast } from '@/components/Toast'

interface BookingRowProps {
  booking: Booking
  onUpdate: (id: string, updates: Partial<Booking>) => void
}

const STATUSES: BookingStatus[] = ['Confirmed', 'Completed', 'Cancelled']

export default function BookingRow({ booking, onUpdate }: BookingRowProps) {
  const { addToast } = useToast()
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(booking.notes || '')
  const [saving, setSaving] = useState(false)

  async function patch(updates: Partial<Booking>) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: adminHeaders(),
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Update failed')
      onUpdate(booking.id, updates)
      addToast('Saved', 'success')
    } catch {
      addToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  function Toggle({ field, value }: { field: keyof Booking; value: boolean }) {
    return (
      <div
        onClick={e => { e.stopPropagation(); patch({ [field]: !value }) }}
        style={{
          width: '34px',
          height: '18px',
          backgroundColor: value ? '#E8FF00' : '#333',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 200ms',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: value ? '#0A0A0A' : '#555',
            position: 'absolute',
            top: '3px',
            left: value ? '19px' : '3px',
            transition: 'left 200ms',
          }}
        />
      </div>
    )
  }

  return (
    <>
      <tr
        onClick={() => setExpanded(e => !e)}
        style={{
          borderBottom: '1px solid #222',
          cursor: 'pointer',
          backgroundColor: expanded ? '#111' : 'transparent',
          transition: 'background-color 200ms',
        }}
        className="booking-row"
      >
        <td style={tdStyle}>
          <div style={{ fontWeight: 500, color: '#F5F5F5', fontSize: '13px' }}>{booking.event_name || '—'}</div>
          <div style={{ fontSize: '11px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>{formatDate(booking.event_date)}</div>
        </td>
        <td style={tdStyle}>
          <div style={{ fontSize: '13px', color: '#D0D0D0' }}>{booking.client_name || '—'}</div>
          <div style={{ fontSize: '11px', color: '#555' }}>{booking.client_company || ''}</div>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '11px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>
            {formatDate(booking.event_date)}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '13px', color: '#D0D0D0' }}>
            {booking.location ? `${booking.location}` : '—'}{booking.country ? `, ${booking.country}` : ''}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#D0D0D0' }}>
            {(booking.workers || []).length} workers
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '13px', color: '#E8FF00', fontFamily: "'Syne Mono', monospace", fontWeight: 500 }}>
            {formatCurrency(booking.total_invoice_value)}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#D0D0D0', fontFamily: "'Syne Mono', monospace" }}>
            {formatCurrency(booking.worker_cost)}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#4DFF91', fontFamily: "'Syne Mono', monospace" }}>
            {formatCurrency(booking.margin)}
          </span>
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <Toggle field="deposit_paid" value={booking.deposit_paid} />
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <Toggle field="invoice_sent" value={booking.invoice_sent} />
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <Toggle field="invoice_paid" value={booking.invoice_paid} />
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <select
            value={booking.status}
            onChange={e => patch({ status: e.target.value as BookingStatus })}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: "'Syne Mono', monospace",
              border: '1px solid #333',
              backgroundColor: '#1A1A1A',
              color: booking.status === 'Confirmed' ? '#E8FF00' : booking.status === 'Completed' ? '#4DFF91' : '#FF3D3D',
              cursor: 'pointer',
            }}
            disabled={saving}
          >
            {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: '#1A1A1A', color: '#F5F5F5' }}>{s}</option>)}
          </select>
        </td>
        <td style={{ ...tdStyle, textAlign: 'right' }}>
          <span style={{ color: '#555', fontSize: '18px' }}>{expanded ? '▲' : '▼'}</span>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={13} style={{ backgroundColor: '#0D0D0D' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid #222' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <Field label="Client Email" value={booking.client_email} />
                <Field label="End Date" value={formatDate(booking.event_end_date)} />
                <Field label="Deposit Amount" value={formatCurrency(booking.deposit_amount)} />
                <Field label="Factoring Used" value={booking.factoring_used ? 'Yes' : 'No'} />
                <Field label="Workers" value={`${(booking.workers || []).length} assigned`} />
                <Field label="Brief ID" value={booking.brief_id} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={labelStyle}>Notes</div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  onBlur={() => patch({ notes })}
                  rows={3}
                  placeholder="Add notes..."
                  style={{ marginTop: '8px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>
          </td>
        </tr>
      )}

      <style jsx>{`
        .booking-row:hover { background-color: #0D0D0D !important; }
      `}</style>
    </>
  )
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  verticalAlign: 'middle',
  fontSize: '13px',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Syne Mono', monospace",
  fontSize: '10px',
  letterSpacing: '2px',
  color: '#555',
  marginBottom: '4px',
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div style={labelStyle}>{label.toUpperCase()}</div>
      <div style={{ fontSize: '13px', color: '#D0D0D0' }}>{value || '—'}</div>
    </div>
  )
}
