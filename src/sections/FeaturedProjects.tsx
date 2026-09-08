import ProjectCard from '../components/ProjectCard'
import { PROJECTS } from '../data/projects'

export default function Tools() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      style={{
        borderTop: '1px solid var(--rw-border)',
        padding: '96px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <p style={labelStyle}>Tools</p>
        <h2
          id="tools-heading"
          style={headingStyle}
        >
          Browser tools I've built
        </h2>

        <p
          style={{
            fontSize: 15,
            color: 'var(--rw-text-secondary)',
            margin: '16px 0 48px',
            maxWidth: 560,
            lineHeight: 1.70,
          }}
        >
          Standalone web applications for VFX and technical-art workflows, built with
          Three.js and TypeScript.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
            gap: 24,
          }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-tertiary)',
  margin: '0 0 12px',
}

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: 'var(--rw-text-primary)',
  margin: 0,
}
