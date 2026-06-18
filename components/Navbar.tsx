'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #222222',
        height: '72px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 48px',
        }}
        className="px-6 md:px-12"
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Logo size="sm" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/join" className="nav-link">
            JOIN OUR ROSTER
          </Link>
          <a href="/#brief-form" className="nav-link">
            SUBMIT A BRIEF
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none' }}
        >
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1.5px',
              backgroundColor: mobileOpen ? '#E8FF00' : '#D0D0D0',
              transition: 'all 200ms ease',
              transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1.5px',
              backgroundColor: mobileOpen ? '#E8FF00' : '#D0D0D0',
              transition: 'all 200ms ease',
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: 'block',
              width: '24px',
              height: '1.5px',
              backgroundColor: mobileOpen ? '#E8FF00' : '#D0D0D0',
              transition: 'all 200ms ease',
              transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden animate-slide-down"
          style={{
            backgroundColor: '#0A0A0A',
            borderBottom: '1px solid #222',
            padding: '24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <Link
            href="/join"
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            JOIN OUR ROSTER
          </Link>
          <a
            href="/#brief-form"
            className="nav-link"
            onClick={() => setMobileOpen(false)}
          >
            SUBMIT A BRIEF
          </a>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 400;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #D0D0D0;
          text-decoration: none;
          transition: color 200ms ease;
        }
        .nav-link:hover {
          color: #E8FF00;
        }
      `}</style>
    </nav>
  )
}
