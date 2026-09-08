const CONTACT_LINKS = [
  {
    id:    'linkedin',
    label: 'LinkedIn',
    sub:   '/in/bisarremochi',
    url:   'https://www.linkedin.com/in/bisarremochi/',
  },
  {
    id:    'artstation',
    label: 'ArtStation',
    sub:   'roowiki',
    url:   'https://www.artstation.com/roowiki',
  },
  {
    id:    'github',
    label: 'GitHub',
    sub:   'RooWiki',
    url:   'https://github.com/RooWiki',
  },
  {
    id:    'sketchfab',
    label: 'Sketchfab',
    sub:   'andrespineros',
    url:   'https://sketchfab.com/andrespineros',
  },
  {
    id:    'behance',
    label: 'Behance',
    sub:   'santi857',
    url:   'https://www.behance.net/santi857',
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '96px 0 120px',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 56,
            alignItems: 'start',
          }}
        >
          {/* Left: CTA text */}
          <div>
            <p style={labelStyle}>Contact</p>
            <h2 id="contact-heading" style={headingStyle}>
              Get in touch
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'var(--rw-text-secondary)',
                lineHeight: 1.75,
                margin: '20px 0 0',
                maxWidth: 380,
              }}
            >
              Open to VFX and Technical Art roles, freelance projects, and
              interesting collaborations. Find me on any of the platforms below.
            </p>
          </div>

          {/* Right: links */}
          <nav aria-label="Contact links">
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {CONTACT_LINKS.map(link => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} — ${link.sub} (opens in new tab)`}
                    style={linkRowStyle}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.backgroundColor = 'var(--rw-surface)'
                      el.style.borderColor     = 'var(--rw-border)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.backgroundColor = 'transparent'
                      el.style.borderColor     = 'transparent'
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--rw-text-primary)' }}>
                      {link.label}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--rw-text-tertiary)' }}>
                      {link.sub}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-tertiary)',
  margin: '0 0 12px',
}

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: 'var(--rw-text-primary)',
  margin: 0,
}

const linkRowStyle: React.CSSProperties = {
  display:        'flex',
  justifyContent: 'space-between',
  alignItems:     'center',
  padding:        '12px 16px',
  borderRadius:   8,
  border:         '1px solid transparent',
  transition:     'background-color 0.15s ease, border-color 0.15s ease',
}
