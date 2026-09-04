import { PROFILE_LINKS } from '../data/links'

export default function SelectedWork() {
  return (
    <section
      aria-labelledby="selected-work-heading"
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
        }}
      >
        <p
          style={{
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--rw-text-tertiary)',
            marginBottom: 12,
          }}
        >
          Creative Work
        </p>

        <h2
          id="selected-work-heading"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--rw-text-primary)',
            margin: '0 0 12px',
          }}
        >
          Selected Work
        </h2>

        <p
          style={{
            fontSize: 14,
            color: 'var(--rw-text-secondary)',
            margin: '0 0 40px',
            lineHeight: 1.6,
          }}
        >
          3D art, VFX, and design work across professional platforms.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {PROFILE_LINKS.map(({ id, label, url, description }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label}${description ? ' — ' + description : ''} (opens in new tab)`}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 4,
                padding: '16px 20px',
                background: 'var(--rw-surface)',
                border: '1px solid var(--rw-border)',
                borderRadius: 10,
                minWidth: 160,
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--rw-text-secondary)'
                e.currentTarget.style.backgroundColor = 'var(--rw-surface-2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--rw-border)'
                e.currentTarget.style.backgroundColor = 'var(--rw-surface)'
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--rw-text-primary)',
                }}
              >
                {label}
              </span>
              {description && (
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--rw-text-tertiary)',
                  }}
                >
                  {description}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
