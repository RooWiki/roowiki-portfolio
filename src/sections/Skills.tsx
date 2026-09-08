import { SKILL_GROUPS } from '../data/skills'

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '96px 0',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <p style={labelStyle}>Skills</p>
        <h2 id="skills-heading" style={headingStyle}>
          Capabilities
        </h2>

        <div
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            gap: 32,
          }}
        >
          {SKILL_GROUPS.map(group => (
            <div key={group.category}>
              <h3 style={groupHeadingStyle}>{group.category}</h3>
              <ul
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {group.skills.map(skill => (
                  <li key={skill}>
                    <span style={tagStyle}>{skill}</span>
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

const groupHeadingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--rw-text-primary)',
  margin: '0 0 14px',
}

const tagStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 12,
  color: 'var(--rw-text-secondary)',
  padding: '3px 9px',
  background: 'var(--rw-surface)',
  border: '1px solid var(--rw-border)',
  borderRadius: 5,
  lineHeight: 1.5,
}
