'use client'

import { useState } from 'react'
import { ClientBrief, BriefStatus } from '@/lib/types'
import { briefStatusStyle, formatDate, adminHeaders } from '@/lib/utils'
import { useToast } from '@/components/Toast'

interface BriefRowProps {
  brief: ClientBrief
  onUpdate: (id: string, updates: Partial<ClientBrief>) => void
  onConvertToBooking: (brief: ClientBrief) => void
}

const STATUSES: BriefStatus[] = ['New', 'In Discussion', 'Quoted', 'Booked', 'Declined']

export default function BriefRow({ brief, onUpdate, onConvertToBooking }: BriefRowProps) {
  const { addToast } = useToast()
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(brief.notes || '')
  const [saving, setSaving] = useState(false)

  async function patch(updates: Partial<ClientBrief>) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/briefs/${brief.id}`, {
        method: 'PATCH',
        headers: adminHeaders(),
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Update failed')
      onUpdate(brief.id, updates)
      addToast('Saved', 'success')
    } catch {
      addToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
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
        className="brief-row"
      >
        <td style={tdStyle}>
          <div style={{ fontWeight: 500, color: '#F5F5F5', fontSize: '13px' }}>{brief.full_name}</div>
          <div style={{ fontSize: '11px', color: '#555' }}>{brief.email}</div>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '13px', color: '#D0D0D0' }}>{brief.company || '—'}</span>
        </td>
        <td style={tdStyle}>
          <div style={{ fontSize: '13px', color: '#F5F5F5' }}>{brief.event_name || '—'}</div>
          <div style={{ fontSize: '11px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>{brief.event_type || ''}</div>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#D0D0D0', fontFamily: "'Syne Mono', monospace" }}>
            {formatDate(brief.event_date)}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#D0D0D0' }}>
            {brief.location ? `${brief.location}` : '—'}{brief.country ? `, ${brief.country}` : ''}
          </span>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#D0D0D0' }}>{brief.staff_count || '—'}</span>
        </td>
        <td style={tdStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(brief.roles || []).slice(0, 2).map(r => (
              <span key={r} style={{ fontSize: '10px', border: '1px solid #333', padding: '2px 6px', color: '#D0D0D0', fontFamily: "'Syne Mono', monospace" }}>{r}</span>
            ))}
            {(brief.roles || []).length > 2 && (
              <span style={{ fontSize: '10px', color: '#555' }}>+{brief.roles.length - 2}</span>
            )}
          </div>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '11px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>
            {formatDate(brief.created_at)}
          </span>
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <select
            value={brief.status}
            onChange={e => patch({ status: e.target.value as BriefStatus })}
            className={briefStatusStyle(brief.status)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: "'Syne Mono', monospace",
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontWeight: 700,
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
          <td colSpan={10} style={{ backgroundColor: '#0D0D0D' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid #222' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <Field label="Phone" value={brief.phone} />
                <Field label="Event Type" value={brief.event_type} />
                <Field label="End Date" value={formatDate(brief.event_end_date)} />
                <Field label="Staff Count" value={brief.staff_count} />
                <Field label="Budget" value={brief.budget} />
                <Field label="Deposit Agreed" value={brief.deposit_agreed ? 'Yes' : 'No'} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={labelStyle}>Roles Needed</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {(brief.roles || []).map(r => (
                    <span key={r} style={{ border: '1px solid #333', padding: '4px 10px', fontSize: '12px', color: '#D0D0D0', fontFamily: "'Syne Mono', monospace" }}>{r}</span>
                  ))}
                </div>
              </div>

              {brief.information && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={labelStyle}>Additional Information</div>
                  <p style={{ fontSize: '13px', color: '#D0D0D0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{brief.information}</p>
                </div>
              )}

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

              <button
                className="btn-primary"
                onClick={() => onConvertToBooking(brief)}
                style={{ fontSize: '11px', padding: '10px 20px' }}
              >
                CONVERT TO BOOKING
              </button>
            </div>
          </td>
        </tr>
      )}

      <style jsx>{`
        .brief-row:hover { background-color: #0D0D0D !important; }
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
