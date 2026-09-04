import type { Theme } from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Links', href: '#links' },
]

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--rw-border)',
        background: 'var(--rw-bg)',
        transition: 'background-color 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Brand */}
        <a
          href="#top"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--rw-text-primary)',
            letterSpacing: '-0.01em',
            marginRight: 'auto',
          }}
        >
          RooWiki
        </a>

        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul
            style={{
              display: 'flex',
              gap: 4,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  style={{
                    display: 'block',
                    padding: '6px 10px',
                    fontSize: 14,
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

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}
