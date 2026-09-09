export default function Footer() {
  return (
    <footer
      aria-label="Footer"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--rw-text-secondary)', opacity: 0.5 }}>
        © 2026 RooWiki · Technical Artist
      </span>
    </footer>
  )
}
