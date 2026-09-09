export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="rw-section">
      <div className="rw-split">
        <div className="rw-split-left" />
        <div className="rw-split-right rw-contact">
          <p className="rw-eyebrow">Contact</p>
          <h2 id="contact-heading">Let’s make<br />something move.</h2>
          <p className="rw-contact-intro">For technical art, real-time effects and tools for artists.</p>
          <a className="rw-button" href="mailto:roowiki@gmail.com">roowiki@gmail.com <span aria-hidden="true">↗</span></a>
          <div className="rw-contact-details"><span>Andrés Piñeros · Montréal, QC</span><a href="tel:+14382236229">+1 (438) 223-6229</a></div>
          <nav aria-label="Social profiles" className="rw-contact-social">
            {[
              { label: 'LinkedIn', url: 'https://www.linkedin.com/in/bisarremochi/' },
              { label: 'ArtStation', url: 'https://www.artstation.com/roowiki' },
              { label: 'GitHub', url: 'https://github.com/RooWiki' },
            ].map(link => <a className="rw-text-link" key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in new tab)`}>{link.label} ↗</a>)}
          </nav>
        </div>
      </div>
    </section>
  )
}
