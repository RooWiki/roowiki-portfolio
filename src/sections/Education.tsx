const EDUCATION = [
  {
    period: 'Feb. 2025 – Aug. 2026',
    institution: 'HSM Adult Education Centre',
    title: 'Programme de francisation à temps complet',
    description: 'French language courses and cultural adaptation.',
    skills: 'French',
  },
  {
    period: 'Apr. 2024 – Oct. 2024',
    institution: 'Generation Colombia',
    title: 'English Language Course',
    description:
      'Improved fluency and pronunciation through interactive conversations and real-life scenarios.',
    skills: null,
  },
  {
    period: '2022 – 2023',
    institution: 'Generation Colombia',
    title: 'Unity C# Developer · Game Development Bootcamp',
    description: 'Game development bootcamp on the Unity engine.',
    skills: 'Unity · Adobe Photoshop',
  },
  {
    period: '2021',
    institution: 'Gnomon',
    title: 'ZBrush 2021 — Sculpting and Texturing in ZBrush',
    description: null,
    skills: null,
  },
  {
    period: '2021',
    institution: 'Gnomon',
    title: 'Creating a Male Groom with XGen',
    description: 'Groom in Maya.',
    skills: null,
  },
]

export default function Education() {
  return (
    <section id="education" aria-labelledby="education-heading" className="rw-section">
      <div className="rw-split">
        <div className="rw-split-left" />

        <div className="rw-split-right">
          <p style={labelStyle}>Education</p>
          <h2 id="education-heading" style={headingStyle}>Background</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {EDUCATION.map((item, i) => (
              <div key={i} style={itemStyle}>
                <p style={periodStyle}>{item.period}</p>
                <p style={institutionStyle}>{item.institution}</p>
                <p style={titleStyle}>{item.title}</p>
                {item.description && <p style={descStyle}>{item.description}</p>}
                {item.skills && <p style={skillsStyle}>{item.skills}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  margin: '0 0 20px',
}

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: 'var(--rw-text-primary)',
  margin: '0 0 36px',
  lineHeight: 1.1,
}

const itemStyle: React.CSSProperties = {
  borderLeft: '1px solid var(--rw-border)',
  paddingLeft: 16,
}

const periodStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  margin: '0 0 4px',
  fontWeight: 600,
}

const institutionStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  margin: '0 0 6px',
  opacity: 0.7,
}

const titleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: 'var(--rw-text-primary)',
  margin: '0 0 6px',
  lineHeight: 1.4,
}

const descStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--rw-text-secondary)',
  margin: '0 0 6px',
  lineHeight: 1.7,
  maxWidth: 400,
}

const skillsStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--rw-text-secondary)',
  margin: '4px 0 0',
  letterSpacing: '0.04em',
  opacity: 0.7,
}
