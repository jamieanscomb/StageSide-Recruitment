'use client'

import { useState, useEffect, FormEvent } from 'react'
import Logo from '@/components/Logo'
import WorkersTab from '@/components/admin/WorkersTab'
import BriefsTab from '@/components/admin/BriefsTab'
import BookingsTab from '@/components/admin/BookingsTab'
import MarketsTab from '@/components/admin/MarketsTab'

type Tab = 'workers' | 'briefs' | 'bookings' | 'markets'

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: 'workers', label: 'Workers', icon: '👤' },
  { id: 'briefs', label: 'Client Briefs', icon: '📋' },
  { id: 'bookings', label: 'Bookings', icon: '📅' },
  { id: 'markets', label: 'Markets', icon: '🌍' },
]

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('workers')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('stageside_admin_auth')
    if (auth === 'true') setAuthed(true)
    setChecking(false)
  }, [])

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    const correctPassword = 'stageside2026admin'
    if (password === correctPassword) {
      localStorage.setItem('stageside_admin_auth', 'true')
      localStorage.setItem('stageside_admin_pass', password)
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  function handleSignOut() {
    localStorage.removeItem('stageside_admin_auth')
    localStorage.removeItem('stageside_admin_pass')
    setAuthed(false)
    setPassword('')
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="animate-pulse-accent" style={{ color: '#E8FF00', fontFamily: "'Syne Mono', monospace", fontSize: '12px', letterSpacing: '4px' }}>
          LOADING...
        </span>
      </div>
    )
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <Logo size="md" />
        <div style={{ marginTop: '48px', width: '100%', maxWidth: '360px' }}>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              autoFocus
              style={{ marginBottom: '16px', fontSize: '16px', letterSpacing: '2px' }}
            />
            {error && (
              <p style={{
                color: '#FF3D3D',
                fontSize: '13px',
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: '16px',
              }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
            >
              ENTER
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0A0A0A' }}>
      {/* Desktop Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: '240px',
          backgroundColor: '#111111',
          borderRight: '1px solid #222',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        <div style={{ padding: '24px' }}>
          <Logo size="sm" />
        </div>

        <nav style={{ flex: 1, padding: '0 0 24px' }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                background: 'none',
                border: 'none',
                borderLeft: activeTab === item.id ? '2px solid #E8FF00' : '2px solid transparent',
                color: activeTab === item.id ? '#E8FF00' : '#555555',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                fontWeight: activeTab === item.id ? 500 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #222' }}>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 200ms',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#FF3D3D')}
            onMouseOut={e => (e.currentTarget.style.color = '#555')}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div
        className="admin-topbar"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#111',
          borderBottom: '1px solid #222',
          padding: '0 20px',
          height: '60px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size="sm" />
        <button
          onClick={() => setMobileNavOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: '#D0D0D0', fontSize: '22px', cursor: 'pointer', padding: 0 }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileNavOpen && (
        <div
          className="admin-mobile-nav"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            zIndex: 49,
            backgroundColor: '#111',
            borderBottom: '1px solid #222',
            padding: '12px 0',
          }}
        >
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileNavOpen(false) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 24px',
                background: 'none',
                border: 'none',
                color: activeTab === item.id ? '#E8FF00' : '#D0D0D0',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div style={{ padding: '12px 24px', borderTop: '1px solid #222', marginTop: '8px' }}>
            <button
              onClick={handleSignOut}
              style={{ background: 'none', border: 'none', color: '#555', fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className="admin-main"
        style={{
          flex: 1,
          marginLeft: '240px',
          padding: '40px',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {activeTab === 'workers' && <WorkersTab />}
        {activeTab === 'briefs' && <BriefsTab />}
        {activeTab === 'bookings' && <BookingsTab />}
        {activeTab === 'markets' && <MarketsTab />}
      </main>

      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar { display: flex !important; }
          .admin-main {
            margin-left: 0 !important;
            padding: 80px 20px 40px !important;
          }
        }
      `}</style>
    </div>
  )
}
