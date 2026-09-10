import './hero.css'

export default function Hero() {
  return (
    <section id="top" className="rw-explosion-hero" aria-label="Introduction">
      <div className="rw-explosion-copy">
        <p className="rw-hero-eyebrow">Technical art · Montréal, Canada</p>
        <h1>RooWiki</h1>
        <p>Andrés Piñeros <span> / Shaders · VFX · Tools</span></p>
        <div className="rw-hero-actions">
          <a className="rw-button" href="#work">Explore the work <span aria-hidden="true">↗</span></a>
          <a className="rw-text-link" href="#contact">Get in touch <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <a href="#about" className="rw-scroll-link">Discover more <span aria-hidden="true">↓</span></a>
    </section>
  )
}
