export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '96px 24px 80px',
      }}
    >
      <p
        style={{
          fontSize: 13,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--rw-text-secondary)',
          marginBottom: 20,
        }}
      >
        Portfolio
      </p>

      <h1
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'var(--rw-text-primary)',
          margin: '0 0 16px',
        }}
      >
        RooWiki
      </h1>

      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--rw-text-secondary)',
          margin: '0 0 24px',
          letterSpacing: '-0.01em',
        }}
      >
        Technical Artist · VFX · Tools
      </p>

      <p
        style={{
          fontSize: 16,
          color: 'var(--rw-text-secondary)',
          maxWidth: 520,
          lineHeight: 1.7,
          margin: '0 0 40px',
        }}
      >
        I create real-time visual effects, shaders, and tools for artists — working at the
        intersection of art and engineering.
      </p>

      <a
        href="#work"
        style={{
          display: 'inline-block',
          padding: '10px 24px',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--rw-text-primary)',
          border: '1px solid var(--rw-border)',
          borderRadius: 8,
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--rw-surface-2)'
          e.currentTarget.style.borderColor = 'var(--rw-text-secondary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.borderColor = 'var(--rw-border)'
        }}
      >
        View Work
      </a>
    </section>
  )
}
