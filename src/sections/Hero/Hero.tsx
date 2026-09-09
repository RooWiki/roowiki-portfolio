import { lazy, Suspense } from 'react'

const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      style={{
        position: 'relative',
        minHeight: '100svh',
        overflow: 'hidden',
      }}
    >
      {/* 3D canvas — fills the section, no pointer capture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: '#181a1e',
        }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Gradient scrim — ensures text legibility over the VFX canvas */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to top, rgba(8,8,10,0.82) 0%, rgba(8,8,10,0.40) 35%, transparent 65%)',
        }}
      />

      {/* HTML content — two-column: left=visual zone, right=presentation text */}
      <div className="rw-hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* Left: visual zone — VFX shows through, no content */}
        <div className="rw-hero-left" />

        {/* Right: presentation content, right-aligned, pinned to bottom */}
        <div className="rw-hero-right" style={{ pointerEvents: 'none' }}>
          {/* Brand name */}
          <h1
            className="rw-brand"
            style={{
              fontSize: 'clamp(3.5rem, 6vw, 6rem)',
              color: '#f2f2f7',
              margin: '0 0 20px',
            }}
          >
            RooWiki
          </h1>

          {/* Identity line */}
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8e8e93',
              margin: '0 0 28px',
              lineHeight: 1.9,
            }}
          >
            Andrés Piñeros · Technical Artist
            <br />
            Shaders · VFX · Tools
          </p>

          {/* Contact info — links need pointerEvents */}
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: 2.4,
              pointerEvents: 'auto',
              color: 'rgba(142,142,147,0.7)',
            }}
          >
            <div>
              <a
                href="mailto:roowiki@gmail.com"
                style={{ transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#8e8e93' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
              >
                Email: roowiki@gmail.com
              </a>
            </div>
            <div>
              <a
                href="tel:+14382236229"
                style={{ transition: 'color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#8e8e93' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '' }}
              >
                +1 (438) 223-6229
              </a>
            </div>
            <div>Montréal, QC</div>
          </div>
        </div>
      </div>
    </section>
  )
}
