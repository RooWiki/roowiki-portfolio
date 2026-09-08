import { SOFTWARE } from '../data/skills'

// Group by category for display
const CATEGORY_ORDER = ['Engine', 'VFX', '3D', 'Shaders', 'Web', 'Code', 'Art']

const grouped: Record<string, string[]> = {}
for (const entry of SOFTWARE) {
  if (!grouped[entry.category]) grouped[entry.category] = []
  grouped[entry.category].push(entry.name)
}

export default function Software() {
  return (
    <section
      id="software"
      aria-labelledby="software-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '96px 0',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <p style={labelStyle}>Software</p>
        <h2 id="software-heading" style={headingStyle}>
          Tools &amp; Environments
        </h2>

        <div
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {CATEGORY_ORDER.filter(c => grouped[c]).map(cat => (
            <div key={cat}>
              <p style={catLabelStyle}>{cat}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {grouped[cat].map(name => (
                  <li key={name}>
                    <span style={chipStyle}>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
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

const catLabelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-tertiary)',
  margin: '0 0 10px',
  fontWeight: 500,
}

const chipStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--rw-text-secondary)',
  padding: '4px 10px',
  background: 'var(--rw-surface)',
  border: '1px solid var(--rw-border)',
  borderRadius: 6,
}
