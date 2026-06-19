'use client'

import { useState, useEffect, useCallback } from 'react'
import { Worker, WorkerStatus } from '@/lib/types'
import { adminHeaders } from '@/lib/utils'
import WorkerRow from './WorkerRow'
import { useToast } from '@/components/Toast'

const STATUSES: WorkerStatus[] = ['Applied', 'Vetted', 'Tier 1', 'Tier 2', 'Tier 3', 'Rejected']
const ROLES = ['Bar Staff', 'Stagehand', 'Steward', 'Merch', 'Runner', 'Supervisor', 'Brand Ambassador', 'VIP Host']
const MARKETS = ['UK', 'Ireland', 'Ibiza', 'Croatia', 'Netherlands', 'Belgium']

export default function WorkersTab() {
  const { addToast } = useToast()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole] = useState('')
  const [market, setMarket] = useState('')
  const [international, setInternational] = useState('')

  const stats = {
    total: count,
    tier1: workers.filter(w => w.tier === 'Tier 1').length,
    pending: workers.filter(w => w.status === 'Applied' || w.status === 'Vetted').length,
    active: workers.filter(w => w.deel_contract_active).length,
  }

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (role) params.set('role', role)
      if (market) params.set('market', market)
      if (international) params.set('international', international)

      const res = await fetch(`/api/admin/workers?${params}`, { headers: adminHeaders() })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setWorkers(data.data || [])
      setCount(data.count || 0)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load workers', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, search, status, role, market, international, addToast])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])

  function handleUpdate(id: string, updates: Partial<Worker>) {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }

  function clearFilters() {
    setSearch(''); setStatus(''); setRole(''); setMarket(''); setInternational(''); setPage(1)
  }

  const totalPages = Math.ceil(count / 25)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#F5F5F5', marginBottom: '4px' }}>Worker Roster</h1>
        <p style={{ fontSize: '13px', color: '#555', fontFamily: "'Syne Mono', monospace" }}>
          {count} workers total
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginBottom: '32px' }} className="stats-grid">
        <StatCard label="TOTAL WORKERS" value={count} />
        <StatCard label="TIER 1" value={stats.tier1} />
        <StatCard label="PENDING REVIEW" value={stats.pending} />
        <StatCard label="ACTIVE THIS MONTH" value={stats.active} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'flex-end' }}>
        <input
          type="text"
          placeholder="Search name, email, city..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={{ flex: 1, minWidth: '200px', fontSize: '13px' }}
        />
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">All roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={market} onChange={e => { setMarket(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">All markets</option>
          {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={international} onChange={e => { setInternational(e.target.value); setPage(1) }} style={{ fontSize: '13px' }}>
          <option value="">International: All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
        <button className="btn-secondary" onClick={clearFilters} style={{ fontSize: '11px', padding: '10px 16px', whiteSpace: 'nowrap' }}>
          CLEAR
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }} className="scrollbar-thin">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              {['Name', 'Location', 'Markets', 'Roles', 'Experience', 'Status', 'Tier', 'Applied', 'Telegram', ''].map(h => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontFamily: "'Syne Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '2px',
                  color: '#555',
                  fontWeight: 400,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center' }}>
                <span className="animate-pulse-accent" style={{ color: '#E8FF00', fontFamily: "'Syne Mono', monospace", fontSize: '12px' }}>
                  LOADING...
                </span>
              </td></tr>
            ) : workers.length === 0 ? (
              <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '14px' }}>
                No workers found
              </td></tr>
            ) : (
              workers.map(worker => (
                <WorkerRow key={worker.id} worker={worker} onUpdate={handleUpdate} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ fontSize: '11px', padding: '8px 16px' }}
          >
            ← PREVIOUS
          </button>
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: '11px', color: '#555' }}>
            {page} / {totalPages}
          </span>
          <button
            className="btn-secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ fontSize: '11px', padding: '8px 16px' }}
          >
            NEXT →
          </button>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 640px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      backgroundColor: '#111',
      border: '1px solid #222',
      padding: '20px 24px',
    }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: '32px',
        color: '#E8FF00',
        lineHeight: 1,
        marginBottom: '8px',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Syne Mono', monospace",
        fontSize: '10px',
        color: '#555',
        letterSpacing: '2px',
      }}>
        {label}
      </div>
    </div>
  )
}
