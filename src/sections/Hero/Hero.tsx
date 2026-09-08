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
          background: '#08080a',
        }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* HTML content — sits above the canvas */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            width: '100%',
            padding: '0 24px 80px',
          }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8e8e93',
              margin: '0 0 16px',
            }}
          >
            Technical Artist
          </p>

          <h1
            style={{
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: '#f2f2f7',
              margin: '0 0 20px',
            }}
          >
            RooWiki
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
              color: '#8e8e93',
              margin: '0 0 20px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            VFX · Shaders · Tools · Real-Time
          </p>

          <p
            style={{
              fontSize: 16,
              color: '#8e8e93',
              maxWidth: 460,
              lineHeight: 1.75,
              margin: '0 0 48px',
            }}
          >
            I create real-time visual effects, shaders, and artist-friendly tools at the
            intersection of art and engineering.
          </p>

          <a
            href="#work"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.01em',
              color: '#f2f2f7',
              border: '1px solid rgba(242, 242, 247, 0.25)',
              borderRadius: 8,
              pointerEvents: 'auto',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(242, 242, 247, 0.08)'
              e.currentTarget.style.borderColor = 'rgba(242, 242, 247, 0.45)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(242, 242, 247, 0.25)'
            }}
          >
            View My Work
          </a>
        </div>
      </div>
    </section>
  )
}
