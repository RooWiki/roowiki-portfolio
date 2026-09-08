export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '96px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 56,
          alignItems: 'start',
        }}
      >
        {/* Label + heading */}
        <div>
          <p style={labelStyle}>About</p>
          <h2 id="about-heading" style={headingStyle}>
            Technical Artist
          </h2>
          <p style={{ ...bodyStyle, marginTop: 16, color: 'var(--rw-text-tertiary)', fontSize: 14 }}>
            Montréal, Canada
          </p>
        </div>

        {/* Bio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p style={bodyStyle}>
            I'm a Technical Artist focused on real-time visual effects, shaders, and
            artist-friendly tooling. I work at the intersection of art and engineering —
            building the systems that make visual ideas possible at runtime.
          </p>
          <p style={bodyStyle}>
            My work spans GPU particle systems, procedural materials, mesh and UV pipelines,
            and browser-based creative tools. I care about the quality of the effect and
            the quality of the workflow that produces it.
          </p>
          <p style={bodyStyle}>
            Primary environments: Unreal Engine 5, Unity, and the web platform via Three.js
            and WebGL. I write HLSL, GLSL, C#, and TypeScript.
          </p>
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
  marginBottom: 12,
  margin: '0 0 12px',
}

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: 'var(--rw-text-primary)',
  margin: 0,
  lineHeight: 1.15,
}

const bodyStyle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.80,
  color: 'var(--rw-text-secondary)',
  margin: 0,
}
