import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BriefForm from '@/components/BriefForm'
import Link from 'next/link'

const WHAT_WE_COVER = [
  {
    title: 'Music Festivals',
    desc: 'Vetted staff for festivals across UK, Ireland, Croatia, Netherlands and Belgium. Summer season through to October.',
  },
  {
    title: 'Ibiza Club Circuit',
    desc: 'The full Ibiza season. Clubs, boat parties, beach clubs and brand activations May to October.',
  },
  {
    title: 'Nightclubs and Venues',
    desc: 'Year-round staffing for independent venues and club nights across all six markets.',
  },
  {
    title: 'Touring Productions',
    desc: 'Local crew for touring artists across Europe. Stagehands, merch, runners and logistics.',
  },
  {
    title: 'Brand Activations',
    desc: 'Professional teams for label showcases, album launches and brand activations in the music space.',
  },
  {
    title: 'Award Shows and Industry Events',
    desc: 'Front of house, registration, runners and production support for music industry events.',
  },
]

const WHY_STAGESIDE = [
  {
    title: 'Music Specialist',
    desc: "We only work in the music and entertainment industry. Every worker on our roster understands the world they're stepping into.",
  },
  {
    title: 'Vetted Roster',
    desc: 'Every single worker is interviewed, reference checked and tiered before they work a single shift.',
  },
  {
    title: 'UK and Europe',
    desc: "Boots on the ground across six markets. We don't fly workers in. We have local rosters ready.",
  },
  {
    title: 'Fast Deployment',
    desc: 'Roster built to mobilise in 48 hours. Last-minute changes handled without panic.',
  },
]

const MARKETS = [
  { country: 'United Kingdom', flag: '🇬🇧', events: 'Glastonbury · Parklife · Creamfields · Latitude' },
  { country: 'Ireland', flag: '🇮🇪', events: 'Electric Picnic · Longitude · All Together Now' },
  { country: 'Ibiza', flag: '🇪🇸', events: 'DC10 · Ushuaia · Pacha · Amnesia' },
  { country: 'Croatia', flag: '🇭🇷', events: 'Hideout · Sonus · Fresh Island · Outlook' },
  { country: 'Netherlands', flag: '🇳🇱', events: 'Dekmantel · Awakenings · ADE · Mysteryland' },
  { country: 'Belgium', flag: '🇧🇪', events: 'Tomorrowland · Pukkelpop · Extrema · Couleur Café' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <div
            style={{
              width: '28px',
              height: '120px',
              backgroundColor: '#E8FF00',
              clipPath: 'polygon(0 0, 100% 0, 68% 100%, 0% 100%)',
            }}
          />
          <div
            style={{
              width: '16px',
              height: '120px',
              backgroundColor: 'rgba(232, 255, 0, 0.28)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 32% 100%)',
            }}
          />
        </div>

        <h1
          className="hero-headline"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            color: '#F5F5F5',
            letterSpacing: '-2px',
            marginTop: '40px',
            lineHeight: 1,
          }}
        >
          STAGESIDE RECRUITMENT
        </h1>

        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 300,
            fontSize: '20px',
            color: '#555555',
            letterSpacing: '1px',
            marginTop: '16px',
          }}
        >
          The Music Industry&apos;s Staffing Partner
        </p>

        <p
          style={{
            fontFamily: "'Syne Mono', monospace",
            fontSize: '12px',
            color: '#E8FF00',
            letterSpacing: '4px',
            marginTop: '12px',
          }}
        >
          UK · Ireland · Ibiza · Croatia · Netherlands · Belgium
        </p>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <a href="#brief-form" className="btn-primary" style={{ minWidth: '200px' }}>
            SUBMIT A STAFFING BRIEF
          </a>
          <Link href="/join" className="btn-secondary" style={{ minWidth: '200px' }}>
            JOIN OUR ROSTER
          </Link>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 0.3,
          }}
        >
          <div
            style={{
              width: '1px',
              height: '48px',
              backgroundColor: '#E8FF00',
              animation: 'scrollDown 2s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      {/* What We Cover */}
      <section className="section-pad" style={{ backgroundColor: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="section-eyebrow">WHAT WE COVER</span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '36px',
              color: '#F5F5F5',
              marginBottom: '48px',
            }}
          >
            Every corner of the music and entertainment world
          </h2>
          <div className="cover-grid">
            {WHAT_WE_COVER.map(card => (
              <div
                key={card.title}
                style={{
                  backgroundColor: '#1A1A1A',
                  borderTop: '2px solid #E8FF00',
                  padding: '32px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '18px',
                    color: '#F5F5F5',
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '14px',
                    color: '#555555',
                    marginTop: '8px',
                    lineHeight: 1.6,
                  }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Stageside */}
      <section className="section-pad" style={{ backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="section-eyebrow">WHY STAGESIDE</span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '36px',
              color: '#F5F5F5',
              marginBottom: '48px',
            }}
          >
            Built for the music industry. Not adapted for it.
          </h2>
          <div className="why-grid">
            {WHY_STAGESIDE.map(point => (
              <div key={point.title}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span
                    style={{
                      color: '#E8FF00',
                      fontWeight: 700,
                      fontSize: '20px',
                      lineHeight: '1.3',
                      flexShrink: 0,
                    }}
                  >
                    —
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#F5F5F5',
                        marginBottom: '8px',
                      }}
                    >
                      {point.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#555555', lineHeight: 1.6 }}>
                      {point.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="section-pad" style={{ backgroundColor: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '36px',
              color: '#F5F5F5',
              marginBottom: '48px',
            }}
          >
            Six markets. One agency.
          </h2>
          <div className="markets-grid">
            {MARKETS.map(m => (
              <div
                key={m.country}
                style={{
                  backgroundColor: '#1A1A1A',
                  padding: '24px',
                  border: '1px solid #222',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{m.flag}</div>
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#F5F5F5',
                    marginBottom: '8px',
                  }}
                >
                  {m.country}
                </h3>
                <p
                  style={{
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '10px',
                    color: '#555555',
                    letterSpacing: '2px',
                    lineHeight: 1.8,
                  }}
                >
                  {m.events}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief Form */}
      <section id="brief-form" className="section-pad" style={{ backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span className="section-eyebrow">SUBMIT A BRIEF</span>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '36px',
              color: '#F5F5F5',
              marginBottom: '12px',
            }}
          >
            Tell us what you need.
          </h2>
          <p style={{ fontSize: '16px', color: '#555555', marginBottom: '40px' }}>
            We&apos;ll come back to you within 24 hours with availability and a quote.
          </p>
          <BriefForm />
        </div>
      </section>

      <Footer />
    </>
  )
}
