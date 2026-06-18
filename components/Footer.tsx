import Logo from './Logo'

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid #222222',
        padding: '48px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <Logo size="sm" />
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 300,
              fontSize: '13px',
              color: '#555555',
              lineHeight: 1.8,
            }}
          >
            <div>stagesiderecruitment.co.uk</div>
            <div>
              <a
                href="mailto:info@stagesiderecruitment.co.uk"
                className="footer-link"
              >
                info@stagesiderecruitment.co.uk
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid #1A1A1A',
          paddingTop: '24px',
          textAlign: 'center',
          fontFamily: "'Syne Mono', monospace",
          fontSize: '10px',
          color: '#333333',
          letterSpacing: '2px',
        }}
      >
        © 2026 STAGESIDE RECRUITMENT LTD
      </div>
    </footer>
  )
}
