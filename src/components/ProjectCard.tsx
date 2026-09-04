import type { Project } from '../data/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, subtitle, description, liveUrl, repoUrl, primaryCta, image, imageAlt } = project

  return (
    <article
      style={{
        background: 'var(--rw-surface)',
        border: '1px solid var(--rw-border)',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--rw-text-tertiary)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--rw-border)'
      }}
    >
      {/* Media area */}
      <div
        style={{
          aspectRatio: '16 / 9',
          background: 'var(--rw-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt ?? title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Placeholder title={title} />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: '24px 28px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--rw-text-tertiary)',
              margin: '0 0 6px',
            }}
          >
            {subtitle}
          </p>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--rw-text-primary)',
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--rw-text-secondary)',
            margin: 0,
            flex: 1,
          }}
        >
          {description}
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${primaryCta} — ${title} (opens in new tab)`}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 16px',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--rw-text-primary)',
              background: 'var(--rw-surface-2)',
              border: '1px solid var(--rw-border)',
              borderRadius: 7,
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--rw-border)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--rw-surface-2)'
            }}
          >
            {primaryCta}
          </a>

          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub repository for ${title} (opens in new tab)`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 16px',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--rw-text-secondary)',
              border: '1px solid var(--rw-border)',
              borderRadius: 7,
              gap: 6,
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--rw-surface-2)'
              e.currentTarget.style.color = 'var(--rw-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--rw-text-secondary)'
            }}
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </article>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 24,
        background: 'var(--rw-surface-2)',
        border: '1px dashed var(--rw-border)',
        margin: 1,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--rw-text-tertiary)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: 11,
          color: 'var(--rw-text-tertiary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}
      >
        Media coming soon
      </span>
    </div>
  )
}

function GitHubIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}
