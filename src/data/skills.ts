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
