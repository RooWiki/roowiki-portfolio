export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
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
      'A browser-based procedural editor for designing magic-circle VFX and exporting transparent textures for game-engine workflows.',
    liveUrl: 'https://circle-editor.pages.dev/circleeditor/',
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
      'A browser-based mesh utility focused on preparing geometry data for shader and technical-art workflows.',
    liveUrl: 'https://roowiki.com/',
    repoUrl: 'https://github.com/RooWiki/shadermesh',
    primaryCta: 'Open Tool',
    image: '/projects/mesh-editor.png',
    imageAlt: 'Mesh Editor — browser-based mesh utility showing geometry viewport, inspector panel, and UV map controls',
  },
]
