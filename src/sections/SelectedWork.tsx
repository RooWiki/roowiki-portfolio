import { useState } from 'react'

// Replace image paths with ArtStation CDN URLs once available.
// ArtStation blocks automated fetching (403) — add URLs manually.
const PROJECTS = [
  {
    id: 'heavy-portal',
    name: 'Heavy Portal',
    url: 'https://www.artstation.com/roowiki',
    image: '/projects/heavy-portal.jpg',
    imageAlt: 'Heavy Portal',
  },
  {
    id: 'water-shader',
    name: 'Water Shader',
    url: 'https://www.artstation.com/roowiki',
    image: '/projects/water-shader.png',
    imageAlt: 'Water Shader',
  },
  {
    id: 'flame-shader',
    name: 'Flame Shader',
    url: 'https://www.artstation.com/roowiki',
    image: '/projects/flame-shader.png',
    imageAlt: 'Flame Shader',
  },
  {
    id: 'triplanar-mapping',
    name: 'Triplanar Mapping',
    url: 'https://www.artstation.com/roowiki',
    image: '/projects/triplanar-mapping.jpg',
    imageAlt: 'Triplanar Mapping',
  },
]

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading">
      <p className="rw-gallery-label" id="projects-heading" role="heading" aria-level={2}>
        VFX
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, padding: '0 40px 40px' }}>
        {PROJECTS.map(project => <ThumbCard key={project.id} {...project} />)}
      </div>

      <div style={{ borderTop: '1px solid var(--rw-border)', padding: '14px 40px', display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href="https://www.artstation.com/roowiki"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rw-text-secondary)', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f2f2f7' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--rw-text-secondary)' }}
        >
          All work on ArtStation →
        </a>
      </div>
    </section>
  )
}

interface ThumbCardProps {
  name: string
  url: string
  image: string
  imageAlt: string
}

function ThumbCard({ name, url, image, imageAlt }: ThumbCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} on ArtStation (opens in new tab)`}
      title={name}
      style={{
        display: 'block',
        width: 200,
        height: 200,
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        background: '#0e0e10',
        borderRadius: 6,
        outline: hovered ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
        transition: 'outline-color 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={image}
        alt={imageAlt}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          filter: hovered ? 'brightness(1.0)' : 'brightness(0.78)',
          transition: 'transform 0.35s ease, filter 0.35s ease',
        }}
      />
    </a>
  )
}
