// ─── Additional project entries not in the main Projects data ─────────────────

const PORTFOLIO_ITEMS = [
  {
    id: 'vfx-portfolio',
    label: 'VFX & Shaders',
    sublabel: 'ArtStation',
    description: '3D art, real-time effects, and shader experiments.',
    url: 'https://www.artstation.com/roowiki',
  },
  {
    id: '3d-models',
    label: '3D Models',
    sublabel: 'Sketchfab',
    description: 'Interactive 3D models and scenes.',
    url: 'https://sketchfab.com/andrespineros',
  },
  {
    id: 'design-work',
    label: 'Design Work',
    sublabel: 'Behance',
    description: 'Creative and design projects.',
    url: 'https://www.behance.net/santi857',
  },
]

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '96px 0',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <p style={labelStyle}>Projects</p>
        <h2 id="projects-heading" style={headingStyle}>
          Portfolio &amp; Work
        </h2>

        <p
          style={{
            fontSize: 15,
            color: 'var(--rw-text-secondary)',
            margin: '16px 0 48px',
            maxWidth: 520,
            lineHeight: 1.70,
          }}
        >
          VFX, shaders, 3D art, and design work across external platforms.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: 16,
          }}
        >
          {PORTFOLIO_ITEMS.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} on ${item.sublabel} (opens in new tab)`}
              style={cardStyle}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--rw-text-tertiary)'
                el.style.backgroundColor = 'var(--rw-surface)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--rw-border)'
                el.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--rw-text-primary)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--rw-text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {item.sublabel}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--rw-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {item.description}
              </p>
              <span style={{ display: 'inline-block', marginTop: 14, fontSize: 12, color: 'var(--rw-text-tertiary)' }}>
                View →
              </span>
            </a>
          ))}
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

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  border: '1px solid var(--rw-border)',
  borderRadius: 10,
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
}
