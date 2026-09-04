export interface ExternalLink {
  id: string
  label: string
  url: string
  description?: string
}

export const PROFILE_LINKS: ExternalLink[] = [
  {
    id: 'artstation',
    label: 'ArtStation',
    url: 'https://www.artstation.com/roowiki',
    description: '3D art, VFX, and shaders',
  },
  {
    id: 'behance',
    label: 'Behance',
    url: 'https://www.behance.net/santi857',
    description: 'Design and creative work',
  },
  {
    id: 'sketchfab',
    label: 'Sketchfab',
    url: 'https://sketchfab.com/andrespineros',
    description: '3D models and scenes',
  },
]

export const FOOTER_LINKS: ExternalLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/bisarremochi/',
  },
  {
    id: 'artstation',
    label: 'ArtStation',
    url: 'https://www.artstation.com/roowiki',
  },
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/RooWiki',
  },
  {
    id: 'behance',
    label: 'Behance',
    url: 'https://www.behance.net/santi857',
  },
  {
    id: 'sketchfab',
    label: 'Sketchfab',
    url: 'https://sketchfab.com/andrespineros',
  },
]
