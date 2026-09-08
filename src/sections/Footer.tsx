export default function Footer() {
  return (
    <footer
      aria-label="Footer"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '28px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--rw-text-primary)', letterSpacing: '-0.01em' }}>
          RooWiki
        </span>
        <span style={{ fontSize: 12, color: 'var(--rw-text-tertiary)' }}>
          Technical Artist · VFX · Tools
        </span>
      </div>
    </footer>
  )
}
