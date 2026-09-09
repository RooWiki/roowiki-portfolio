export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  capabilities: string[]
  tech: string[]
  liveUrl: string
  repoUrl: string
  primaryCta: string
  /** Relative path from /public or absolute URL. Undefined = show placeholder. */
  image?: string
  imageAlt?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'circle-editor',
    title: 'Circle Editor',
    subtitle: 'Browser Tool · VFX',
    description:
      'A procedural editor for designing layered magic-circle VFX in the browser. Each circle is built from configurable layers — rotating rings, radial patterns, glow — and exported as a transparent PNG texture ready to use in Unreal, Unity, or any particle system.',
    capabilities: [
      'Procedural layer system',
      'Transparent PNG export',
      'Real-time preview',
    ],
    tech: ['Three.js', 'TypeScript', 'WebGL'],
    liveUrl: 'https://roowiki.com/circleeditor/',
    repoUrl: 'https://github.com/RooWiki/VFXMagicCircleEditor',
    primaryCta: 'Open Tool',
    image: '/projects/circle-editor.png',
    imageAlt: 'Circle Editor — procedural magic-circle VFX editor with layers panel and inspector',
  },
  {
    id: 'mesh-editor',
    title: 'Mesh Editor',
    subtitle: 'Browser Tool · Technical Art',
    description:
      'A browser-based mesh utility for preparing geometry for shader workflows. Supports UV mapping with six projection modes, vertex color painting, face and vertex editing with weld support, multi-viewport layout, and OBJ / JSON export — no DCC software required.',
    capabilities: [
      'UV projections (planar, cylindrical, spherical, box)',
      'Vertex + face editing with weld',
      'OBJ / JSON export',
    ],
    tech: ['Three.js', 'TypeScript', 'React', 'Zustand'],
    liveUrl: 'https://roowiki.com/mesheditor/',
    repoUrl: 'https://github.com/RooWiki/shadermesh',
    primaryCta: 'Open Tool',
    image: '/projects/mesh-editor.png',
    imageAlt: 'Mesh Editor — browser-based mesh utility showing geometry viewport, inspector panel, and UV map controls',
  },
]
