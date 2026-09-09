export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="rw-section">
      <div className="rw-split">
        {/* Left: visual zone */}
        <div className="rw-split-left" />

        {/* Right: content */}
        <div className="rw-split-right">
          <p style={labelStyle}>About</p>
          <h2 id="about-heading" style={headingStyle}>
            Andrés Piñeros
          </h2>
          <p style={metaStyle}>Technical Artist · Montréal, Canada</p>
          <p style={bodyStyle}>
            I focus on real-time visual effects, stylized shaders, and browser-based tools
            for artists. My work spans GPU particle systems, procedural materials, and custom
            shader pipelines — built in Unreal Engine 5, Unity, and the web platform via
            Three.js and WebGL. I write HLSL, GLSL, and TypeScript, and care equally about
            the quality of the effect and the workflow that produces it.
          </p>
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
  margin: '0 0 8px',
  lineHeight: 1.1,
}

const metaStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--rw-text-secondary)',
  margin: '0 0 28px',
  letterSpacing: '0.02em',
}

const bodyStyle: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.85,
  color: 'var(--rw-text-secondary)',
  margin: 0,
  maxWidth: 440,
  marginLeft: 'auto',
}
