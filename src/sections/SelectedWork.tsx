import GalleryCard from '../components/GalleryCard'

const PROJECTS = [
  {
    id: 'heavy-portal',
    name: 'Heavy Portal',
    url: 'https://www.artstation.com/artwork/41XLRW',
    image: '/projects/heavy-portal.jpg',
    imageAlt: 'Heavy Portal',
  },
  {
    id: 'water-shader',
    name: 'Water Shader',
    url: 'https://www.artstation.com/artwork/EzNB68',
    image: '/projects/water-shader.png',
    imageAlt: 'Water Shader',
  },
  {
    id: 'flame-shader',
    name: 'Flame Shader',
    url: 'https://www.artstation.com/artwork/WXPNl3',
    image: '/projects/flame-shader.png',
    imageAlt: 'Flame Shader',
  },
  {
    id: 'triplanar-mapping',
    name: 'Triplanar Mapping',
    url: 'https://www.artstation.com/artwork/a0EQKX',
    image: '/projects/triplanar-mapping.jpg',
    imageAlt: 'Triplanar Mapping',
  },
]

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-heading" className="rw-project-section">
      <div className="rw-gallery-heading">
        <div><p className="rw-eyebrow">Visual effects</p><h2 id="projects-heading">VFX</h2></div>
        <p>Real-time effects, shaders & materials.</p>
      </div>
      <div className="rw-square-gallery">
        {PROJECTS.map(project => <GalleryCard key={project.id} {...project} />)}
      </div>
      <a className="rw-gallery-more rw-text-link" href="https://www.artstation.com/roowiki" target="_blank" rel="noopener noreferrer" aria-label="All work on ArtStation (opens in new tab)">All work on ArtStation ↗</a>
    </section>
  )
}
