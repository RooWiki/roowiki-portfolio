const SOFTWARE_ITEMS = [
  { name: 'Unreal Engine 5', cat: 'Engine'  },
  { name: 'Unity',           cat: 'Engine'  },
  { name: 'Niagara',         cat: 'VFX'     },
  { name: 'VFX Graph',       cat: 'VFX'     },
  { name: 'Shader Graph',    cat: 'VFX'     },
  { name: 'Three.js',        cat: 'Web'     },
  { name: 'TypeScript',      cat: 'Web'     },
  { name: 'React',           cat: 'Web'     },
  { name: 'HLSL / GLSL',     cat: 'Shader'  },
  { name: 'Maya',            cat: '3D'      },
  { name: 'Blender',         cat: '3D'      },
  { name: 'Photoshop',       cat: 'Art'     },
  { name: 'Krita',           cat: 'Art'     },
  { name: 'Git',             cat: 'Code'    },
]

export default function Software() {
  return (
    <section id="software" aria-labelledby="software-heading" className="rw-section">
      <div className="rw-split">
        {/* Left: visual zone */}
        <div className="rw-split-left" />

        {/* Right: software grid */}
        <div className="rw-split-right">
          <p style={labelStyle}>Software proficiency</p>
          <h2 id="software-heading" style={headingStyle}>Tools &amp; Environments</h2>

          <div style={gridStyle}>
            {SOFTWARE_ITEMS.map(item => (
              <div key={item.name} style={chipStyle}>
                <span style={catStyle}>{item.cat}</span>
                <span style={nameStyle}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  margin: '0 0 20px',
}

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: 'var(--rw-text-primary)',
  margin: '0 0 32px',
  lineHeight: 1.1,
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: 8,
}

const chipStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  padding: '10px 12px',
  background: 'var(--rw-surface)',
  border: '1px solid var(--rw-border)',
  borderRadius: 6,
  textAlign: 'right',
}

const catStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  opacity: 0.6,
}

const nameStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--rw-text-primary)',
  lineHeight: 1.3,
}
