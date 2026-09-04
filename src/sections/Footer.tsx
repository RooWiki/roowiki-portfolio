import { FOOTER_LINKS } from '../data/links'

export default function Footer() {
  return (
    <footer
      id="links"
      aria-label="Footer"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '48px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--rw-text-primary)',
            letterSpacing: '-0.01em',
          }}
        >
          RooWiki
        </span>

        {/* Links */}
        <nav aria-label="Social and profile links">
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {FOOTER_LINKS.map(({ id, label, url }) => (
              <li key={id}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in new tab)`}
                  style={{
                    display: 'block',
                    padding: '5px 10px',
                    fontSize: 13,
                    color: 'var(--rw-text-secondary)',
                    borderRadius: 6,
                    transition: 'color 0.15s ease, background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--rw-text-primary)'
                    e.currentTarget.style.backgroundColor = 'var(--rw-surface-2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--rw-text-secondary)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
