const SKILL_GROUPS = [
  {
    label: 'Real-Time VFX',
    lines: [
      'GPU Particle Systems · Shader-Driven Particles',
      'Explosion / Destruction FX',
      'Environmental FX · Screen-Space Effects',
    ],
    tools: 'Niagara (UE5) · VFX Graph (Unity) · Three.js',
  },
  {
    label: 'Shaders & Materials',
    lines: [
      'HLSL · GLSL',
      'Procedural Noise · Domain Warping',
      'Vertex Displacement · Post-Processing',
    ],
    tools: 'UE5 Material Editor · Unity Shader Graph · Three.js ShaderMaterial',
  },
  {
    label: 'Tools & Technical Art',
    lines: [
      'UV Workflows · Vertex Colors',
      'Mesh Optimization · Geometry Processing',
      'Browser-Based Editors · Artist Pipelines',
    ],
    tools: 'Three.js · TypeScript / React · Maya · Blender',
  },
]

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="rw-section">
      <div className="rw-split">
        {/* Left: visual zone */}
        <div className="rw-split-left" />

        {/* Right: skills text */}
        <div className="rw-split-right">
          <p style={labelStyle}>Skills</p>
          <h2 id="skills-heading" style={headingStyle}>Capabilities</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {SKILL_GROUPS.map(group => (
              <div key={group.label}>
                <p style={groupLabelStyle}>{group.label}</p>
                {group.lines.map(line => (
                  <p key={line} style={lineStyle}>{line}</p>
                ))}
                <p style={toolsStyle}>{group.tools}</p>
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
  margin: '0 0 36px',
  lineHeight: 1.1,
}

const groupLabelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--rw-text-secondary)',
  margin: '0 0 10px',
  fontWeight: 600,
}

const lineStyle: React.CSSProperties = {
  fontSize: 13,
  letterSpacing: '0.04em',
  color: 'var(--rw-text-primary)',
  margin: '0 0 4px',
  lineHeight: 1.7,
}

const toolsStyle: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--rw-text-secondary)',
  margin: '10px 0 0',
  letterSpacing: '0.02em',
  lineHeight: 1.8,
}
