import ProjectCard from '../components/ProjectCard'
import { PROJECTS } from '../data/projects'

export default function FeaturedProjects() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
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
        <SectionLabel>Featured Projects</SectionLabel>

        <h2
          id="work-heading"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--rw-text-primary)',
            margin: '0 0 48px',
          }}
        >
          Tools I've built
        </h2>

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 12,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--rw-text-tertiary)',
        marginBottom: 12,
      }}
    >
      {children}
    </p>
  )
}
