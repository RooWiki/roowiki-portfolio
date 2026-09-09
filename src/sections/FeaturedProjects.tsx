import { useState } from 'react'

const TOOLS = [
  {
    id: 'circle-editor',
    name: 'Circle Editor',
    url: 'https://roowiki.com/circleeditor/',
    image: '/projects/circle-editor-cover.jpg',
    imageAlt: 'WEB Circle Editor',
  },
  {
    id: 'mesh-editor',
    name: 'Mesh Editor',
    url: 'https://roowiki.com/mesheditor/',
    image: '/projects/mesh-editor-cover.png',
    imageAlt: 'WEB Mesh Editor',
  },
  {
    id: 'auto-rig-tool',
    name: 'Auto Rig Tool',
    url: 'https://www.artstation.com/artwork/Dvkq10',
    image: '/projects/auto-rig-tool.png',
    imageAlt: 'Auto Rig Tool',
  },
]

export default function Tools() {
  return (
    <section id="work" aria-labelledby="tools-heading">
      <p className="rw-gallery-label" id="tools-heading" role="heading" aria-level={2}>
        Tools
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, padding: '0 40px 40px' }}>
        {TOOLS.map(tool => <ThumbCard key={tool.id} {...tool} />)}
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
      aria-label={`${name} (opens in new tab)`}
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
