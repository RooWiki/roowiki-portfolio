// ─── Skill areas (used by the consolidated Skills & Tools section) ────────────

export interface SkillArea {
  id: string
  title: string
  summary: string
  skills: string[]
  tools: string[]
}

export const SKILL_AREAS: SkillArea[] = [
  {
    id: 'vfx',
    title: 'Real-Time VFX',
    summary:
      'GPU particle systems, explosion and destruction effects, and environmental FX — authored in Niagara and VFX Graph, or built from scratch with custom shaders.',
    skills: [
      'GPU Particle Systems',
      'Explosion / Destruction FX',
      'Environmental Effects',
      'Screen-Space Effects',
      'Shader-Driven Particles',
    ],
    tools: ['Niagara (UE5)', 'VFX Graph (Unity)', 'Three.js / GLSL'],
  },
  {
    id: 'shaders',
    title: 'Shaders & Materials',
    summary:
      'Custom ShaderMaterials in HLSL and GLSL — procedural noise, domain warping, vertex displacement, and post-processing, from visual node graphs to hand-written code.',
    skills: [
      'HLSL / GLSL',
      'Procedural Noise',
      'Domain Warping',
      'Vertex Displacement',
      'Post-Processing',
    ],
    tools: ['UE5 Material Editor', 'Unity Shader Graph', 'Three.js ShaderMaterial'],
  },
  {
    id: 'tools',
    title: 'Tools & Technical Art',
    summary:
      'Browser-based tools for VFX and geometry workflows. UV mapping pipelines, vertex color authoring, mesh optimization, and artist-facing interfaces built with the web platform.',
    skills: [
      'UV Workflows',
      'Vertex Colors',
      'Mesh Optimization',
      'Geometry Processing',
      'Procedural Editors',
    ],
    tools: ['Three.js', 'TypeScript / React', 'Maya', 'Blender'],
  },
]

// ─── Software proficiency entries ─────────────────────────────────────────────

export interface SoftwareEntry {
  name:     string
  category: string
}

export const SOFTWARE: SoftwareEntry[] = [
  // Engines
  { name: 'Unreal Engine 5', category: 'Engine' },
  { name: 'Unity',           category: 'Engine' },

  // VFX / Effects
  { name: 'Niagara',         category: 'VFX' },
  { name: 'Shader Graph',    category: 'VFX' },
  { name: 'VFX Graph',       category: 'VFX' },

  // 3D / DCC
  { name: 'Maya',            category: '3D' },
  { name: 'Blender',         category: '3D' },

  // Art
  { name: 'Krita',           category: 'Art' },
  { name: 'Photoshop',       category: 'Art' },

  // Web / Code
  { name: 'Three.js',        category: 'Web' },
  { name: 'TypeScript',      category: 'Web' },
  { name: 'React',           category: 'Web' },

  // Shaders / Languages
  { name: 'HLSL',            category: 'Shaders' },
  { name: 'GLSL',            category: 'Shaders' },
  { name: 'C#',              category: 'Code' },
  { name: 'Git',             category: 'Code' },
]

// ─── Skill categories ─────────────────────────────────────────────────────────

export interface SkillGroup {
  category: string
  skills:   string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Real-Time VFX',
    skills: [
      'Particle Systems',
      'Shader-Driven Effects',
      'Explosion / Destruction FX',
      'Environmental FX',
      'Niagara (UE5)',
      'VFX Graph (Unity)',
      'GPU Particles',
    ],
  },
  {
    category: 'Shaders & Materials',
    skills: [
      'HLSL / GLSL',
      'Shader Graph',
      'Custom ShaderMaterials',
      'Procedural Noise',
      'Domain Warping',
      'Vertex Displacement',
      'Post-Processing',
    ],
  },
  {
    category: 'Technical Art',
    skills: [
      'UV Workflows',
      'Vertex Colors',
      'Normals & Tangents',
      'Mesh Optimization',
      'LOD Authoring',
      'Material Pipelines',
      'Asset Integration',
    ],
  },
  {
    category: 'Tools Development',
    skills: [
      'Browser-Based Tools',
      'Procedural Editors',
      'Geometry Processing',
      'Three.js / WebGL',
      'TypeScript / React',
      'Artist-Friendly Workflows',
    ],
  },
  {
    category: 'Engines & Pipelines',
    skills: [
      'Unreal Engine 5',
      'Unity',
      'Git Workflows',
      'Performance Profiling',
      'Cross-Platform Optimization',
    ],
  },
]
