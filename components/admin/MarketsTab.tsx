'use client'

import { useState, useEffect, useCallback } from 'react'
import { Market, MarketStatus } from '@/lib/types'
import { adminHeaders } from '@/lib/utils'
import { useToast } from '@/components/Toast'

const FLAGS: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'Ireland': '🇮🇪',
  'Ibiza': '🇪🇸',
  'Croatia': '🇭🇷',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
}

const STATUSES: MarketStatus[] = ['Active', 'Building', 'Planned']

interface MarketData extends Market {
  workerCount?: number
  tierBreakdown?: Record<string, number>
}

export default function MarketsTab() {
  const { addToast } = useToast()
  const [markets, setMarkets] = useState<MarketData[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [events, setEvents] = useState<Record<string, string>>({})

  const fetchMarkets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/markets', { headers: adminHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMarkets(data.data || [])
      const ev: Record<string, string> = {}
      for (const m of data.data || []) {
        ev[m.id] = m.upcoming_events || ''
      }
      setEvents(ev)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load markets', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchMarkets() }, [fetchMarkets])

  async function patch(id: string, updates: Partial<Market>) {
    setSaving(id)
    try {
      const res = await fetch(`/api/admin/markets/${id}`, {
        method: 'PATCH',
        headers: adminHeaders(),
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Update failed')
      setMarkets(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
      addToast('Saved', 'success')
    } catch {
      addToast('Failed to save', 'error')
    } finally {
      setSaving(null)
    }
  }

  function statusColor(status: MarketStatus): string {
    switch (status) {
      case 'Active': return '#4DFF91'
      case 'Building': return '#E8FF00'
      case 'Planned': return '#555'
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <span className="animate-pulse-accent" style={{ color: '#E8FF00', fontFamily: "'Syne Mono', monospace", fontSize: '12px' }}>LOADING...</span>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F5', marginBottom: '4px' }}>Market Overview</h1>
        <p style={{ fontSize: '13px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>Six markets managed</p>
      </div>

      <div className="markets-admin-grid">
        {markets.map(market => (
          <div
            key={market.id}
            style={{
              backgroundColor: '#111',
              border: '1px solid #222',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{FLAGS[market.country] || '🌍'}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F5F5F5' }}>{market.country}</h3>
              </div>
              <select
                value={market.status}
                onChange={e => patch(market.id, { status: e.target.value as MarketStatus })}
                disabled={saving === market.id}
                style={{
                  fontSize: '11px',
                  fontFamily: "'Syne Mono', monospace",
                  padding: '4px 8px',
                  border: `1px solid ${statusColor(market.status)}`,
                  backgroundColor: 'transparent',
                  color: statusColor(market.status),
                  cursor: 'pointer',
                  letterSpacing: '1px',
                }}
              >
                {STATUSES.map(s => (
                  <option key={s} value={s} style={{ backgroundColor: '#1A1A1A', color: '#F5F5F5' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Worker count */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#0D0D0D', border: '1px solid #1A1A1A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: '10px', color: '#555', letterSpacing: '2px' }}>WORKERS</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '20px', color: '#E8FF00' }}>
                  {market.workerCount || 0}
                </span>
              </div>
              {market.tierBreakdown && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  {Object.entries(market.tierBreakdown).map(([tier, count]) => (
                    <div key={tier} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#D0D0D0', fontWeight: 500 }}>{count}</div>
                      <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '9px', color: '#555', letterSpacing: '1px' }}>{tier}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming events */}
            <div>
              <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '10px', letterSpacing: '2px', color: '#555', marginBottom: '8px' }}>
                UPCOMING EVENTS
              </div>
              <textarea
                value={events[market.id] || ''}
                onChange={e => setEvents(prev => ({ ...prev, [market.id]: e.target.value }))}
                onBlur={() => patch(market.id, { upcoming_events: events[market.id] })}
                rows={3}
                placeholder="List upcoming events..."
                style={{ fontSize: '12px', resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .markets-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 1024px) {
          .markets-admin-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .markets-admin-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
