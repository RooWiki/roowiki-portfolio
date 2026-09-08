import type { Theme } from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Software', href: '#software' },
  { label: 'Skills',   href: '#skills'   },
  { label: 'Tools',    href: '#tools'    },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact'  },
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
          gap: 4,
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

        {/* Nav — hidden on small screens; visible from md up */}
        <nav
          aria-label="Main navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ul
            style={{
              display: 'flex',
              gap: 2,
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
                    padding: '6px 9px',
                    fontSize: 13,
                    color: 'var(--rw-text-secondary)',
                    borderRadius: 6,
                    transition: 'color 0.15s ease, background-color 0.15s ease',
                    whiteSpace: 'nowrap',
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
