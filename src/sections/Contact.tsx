export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="rw-section">
      <div className="rw-split">
        {/* Left: visual zone */}
        <div className="rw-split-left" />

        {/* Right: contact block */}
        <div className="rw-split-right" style={{ paddingBottom: 96 }}>
          {/* Mail CTA */}
          <a
            href="mailto:roowiki@gmail.com"
            aria-label="Send email to roowiki@gmail.com"
            style={ctaStyle}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'var(--rw-surface-2)'
              el.style.borderColor = 'var(--rw-border-mid)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'transparent'
              el.style.borderColor = 'var(--rw-border)'
            }}
          >
            <MailIcon />
            <span id="contact-heading">Contact</span>
          </a>

          {/* Identity block */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={nameStyle}>Andrés Piñeros</p>
            <p style={roleStyle}>Technical Artist · Shaders · VFX</p>

            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a
                href="mailto:roowiki@gmail.com"
                style={infoLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f7' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--rw-text-secondary)' }}
              >
                roowiki@gmail.com
              </a>
              <a
                href="tel:+14382236229"
                style={infoLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f7' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--rw-text-secondary)' }}
              >
                +1 (438) 223-6229
              </a>
              <span style={infoStyle}>Montréal, QC</span>
            </div>
          </div>

          {/* Social links */}
          <nav aria-label="Social profiles" style={{ marginTop: 36, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            {[
              { label: 'LinkedIn', sub: '/in/bisarremochi', url: 'https://www.linkedin.com/in/bisarremochi/' },
              { label: 'ArtStation', sub: 'roowiki', url: 'https://www.artstation.com/roowiki' },
              { label: 'GitHub', sub: 'RooWiki', url: 'https://github.com/RooWiki' },
            ].map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} — ${link.sub} (opens in new tab)`}
                style={socialRowStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f7' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--rw-text-secondary)' }}
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>{link.label}</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{link.sub}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 12,
  padding: '14px 24px',
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-primary)',
  border: '1px solid var(--rw-border)',
  borderRadius: 8,
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
}

const nameStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--rw-text-primary)',
  margin: 0,
}

const roleStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  margin: 0,
}

const infoLinkStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--rw-text-secondary)',
  letterSpacing: '0.02em',
  transition: 'color 0.15s ease',
}

const infoStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--rw-text-secondary)',
  letterSpacing: '0.02em',
}

const socialRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'baseline',
  color: 'var(--rw-text-secondary)',
  transition: 'color 0.15s ease',
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
