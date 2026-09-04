export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '80px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          gap: 48,
          alignItems: 'start',
        }}
      >
        <div>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--rw-text-tertiary)',
              marginBottom: 12,
            }}
          >
            About
          </p>
          <h2
            id="about-heading"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--rw-text-primary)',
              margin: 0,
            }}
          >
            RooWiki
          </h2>
        </div>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--rw-text-secondary)',
            margin: 0,
            maxWidth: 560,
          }}
        >
          I'm a Technical Artist focused on real-time VFX, shaders, and tools for artists. I enjoy
          working between art and engineering, building visual systems and workflows that make
          technical processes easier to use.
        </p>
      </div>
    </section>
  )
}
