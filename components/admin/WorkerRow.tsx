'use client'

import { useState } from 'react'
import { Worker, WorkerStatus, WorkerTier } from '@/lib/types'
import { workerStatusStyle, formatDate, truncate, adminHeaders } from '@/lib/utils'
import { useToast } from '@/components/Toast'

interface WorkerRowProps {
  worker: Worker
  onUpdate: (id: string, updates: Partial<Worker>) => void
}

const STATUSES: WorkerStatus[] = ['Applied', 'Vetted', 'Tier 1', 'Tier 2', 'Tier 3', 'Rejected']
const TIERS: (WorkerTier | '')[] = ['', 'Tier 1', 'Tier 2', 'Tier 3']

export default function WorkerRow({ worker, onUpdate }: WorkerRowProps) {
  const { addToast } = useToast()
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(worker.notes || '')
  const [rating, setRating] = useState(worker.rating || 0)
  const [saving, setSaving] = useState(false)

  async function patch(updates: Partial<Worker>) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/workers/${worker.id}`, {
        method: 'PATCH',
        headers: adminHeaders(),
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Update failed')
      onUpdate(worker.id, updates)
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
        className="worker-row"
      >
        <td style={tdStyle}>
          <div style={{ fontWeight: 500, color: '#F5F5F5', fontSize: '13px' }}>{worker.full_name}</div>
          <div style={{ fontSize: '11px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>{worker.email}</div>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '13px', color: '#D0D0D0' }}>
            {worker.city ? `${worker.city}` : '—'}{worker.country ? `, ${worker.country}` : ''}
          </span>
        </td>
        <td style={tdStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(worker.markets || []).slice(0, 3).map(m => (
              <span key={m} style={tagStyle}>{m}</span>
            ))}
          </div>
        </td>
        <td style={tdStyle}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {(worker.roles || []).slice(0, 2).map(r => (
              <span key={r} style={tagStyle}>{truncate(r, 12)}</span>
            ))}
            {(worker.roles || []).length > 2 && (
              <span style={{ ...tagStyle, color: '#555' }}>+{worker.roles.length - 2}</span>
            )}
          </div>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '12px', color: '#D0D0D0' }}>{worker.experience || '—'}</span>
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <select
            value={worker.status}
            onChange={e => patch({ status: e.target.value as WorkerStatus })}
            className={`status-select ${workerStatusStyle(worker.status)}`}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: "'Syne Mono', monospace",
              letterSpacing: '1px',
              border: '1px solid',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              minWidth: '90px',
            }}
            disabled={saving}
          >
            {STATUSES.map(s => <option key={s} value={s} style={{ backgroundColor: '#1A1A1A', color: '#F5F5F5' }}>{s}</option>)}
          </select>
        </td>
        <td style={tdStyle} onClick={e => e.stopPropagation()}>
          <select
            value={worker.tier || ''}
            onChange={e => patch({ tier: (e.target.value || null) as WorkerTier })}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: "'Syne Mono', monospace",
              border: '1px solid #333',
              backgroundColor: '#1A1A1A',
              color: '#D0D0D0',
              cursor: 'pointer',
            }}
            disabled={saving}
          >
            {TIERS.map(t => <option key={t || 'none'} value={t || ''} style={{ backgroundColor: '#1A1A1A', color: '#F5F5F5' }}>{t || '—'}</option>)}
          </select>
        </td>
        <td style={tdStyle}>
          <span style={{ fontSize: '11px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>
            {formatDate(worker.created_at)}
          </span>
        </td>
        <td style={{ ...tdStyle, textAlign: 'right' }}>
          <span style={{ color: '#555', fontSize: '18px', lineHeight: 1 }}>{expanded ? '▲' : '▼'}</span>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={9} style={{ backgroundColor: '#0D0D0D', padding: '0' }}>
            <div style={{ padding: '32px', borderBottom: '1px solid #222' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
                <Field label="Phone" value={worker.phone} />
                <Field label="City" value={worker.city} />
                <Field label="Country" value={worker.country} />
                <Field label="Markets" value={(worker.markets || []).join(', ')} />
                <Field label="Roles" value={(worker.roles || []).join(', ')} />
                <Field label="Experience" value={worker.experience} />
                <Field label="Availability" value={(worker.availability || []).join(', ')} />
                <Field label="International" value={worker.international ? 'Yes' : 'No'} />
                <Field label="Languages" value={worker.languages} />
                <Field label="Right to Work UK" value={worker.right_to_work_uk ? 'Yes' : 'No'} />
                <Field label="How they heard" value={worker.heard_from} />
                <Field label="Applied" value={formatDate(worker.created_at)} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={labelStyle}>Events Worked</div>
                <p style={{ fontSize: '13px', color: '#D0D0D0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {worker.events_worked || '—'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {/* Rating */}
                <div>
                  <div style={labelStyle}>Rating</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => { setRating(star); patch({ rating: star }) }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: star <= rating ? '#E8FF00' : '#333',
                          padding: '0',
                          lineHeight: 1,
                          transition: 'color 200ms',
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deel toggle */}
                <div>
                  <div style={labelStyle}>Deel Contract Active</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', cursor: 'pointer' }}>
                    <div
                      onClick={() => patch({ deel_contract_active: !worker.deel_contract_active })}
                      style={{
                        width: '40px',
                        height: '22px',
                        backgroundColor: worker.deel_contract_active ? '#E8FF00' : '#333',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 200ms',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          backgroundColor: worker.deel_contract_active ? '#0A0A0A' : '#555',
                          position: 'absolute',
                          top: '3px',
                          left: worker.deel_contract_active ? '21px' : '3px',
                          transition: 'left 200ms',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: worker.deel_contract_active ? '#4DFF91' : '#555' }}>
                      {worker.deel_contract_active ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Notes */}
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

              {/* CV */}
              {worker.cv_url && (
                <div>
                  <a
                    href={worker.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ display: 'inline-flex', fontSize: '11px', padding: '10px 20px' }}
                  >
                    DOWNLOAD CV
                  </a>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      <style jsx>{`
        .worker-row:hover { background-color: #0D0D0D !important; }
      `}</style>
    </>
  )
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  verticalAlign: 'middle',
  fontSize: '13px',
}

const tagStyle: React.CSSProperties = {
  fontSize: '10px',
  fontFamily: "'Syne Mono', monospace",
  color: '#D0D0D0',
  border: '1px solid #333',
  padding: '2px 6px',
  letterSpacing: '1px',
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
