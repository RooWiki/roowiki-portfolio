import GalleryCard from '../components/GalleryCard'

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
    <section id="work" aria-labelledby="work-heading" className="rw-project-section">
      <div className="rw-gallery-heading">
        <div><p className="rw-eyebrow">Artist tools</p><h2 id="work-heading">Tools</h2></div>
        <p>Built for artists. Ready to explore.</p>
      </div>
      <div className="rw-square-gallery">
        {TOOLS.map(project => <GalleryCard key={project.id} {...project} />)}
      </div>
    </section>
  )
}
