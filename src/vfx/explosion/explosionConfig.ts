import type { Vector3Tuple } from 'three'

// Single authoritative world-space origin for all explosion systems.
// Fireball, shockwave, sparks, debris, dust, and lighting all reference this.
export const EXPLOSION_ORIGIN: Vector3Tuple = [2.2, 0.0, -1.5]

// Cycle: how long between ignition events (development loop).
// Later phases can change the trigger model (once-on-load, interaction-driven, etc.)
// without touching individual VFX modules.
export const CYCLE_DURATION = 8.0 // seconds

// Sub-timings within one cycle (seconds from cycle start).
// Centralised here so Phase 3+ modules can be authored against the same clock.
export const TIMING = {
  // Ignition core
  ignitionPeak: 0.05,  // sharp brightness peak
  ignitionEnd:  0.18,  // core fully gone

  // Flash / glow layers
  flashPeak:    0.04,
  flashEnd:     0.25,

  // Outer bloom approximation
  bloomEnd:     0.32,

  // Dynamic point light
  lightPeak:    0.08,
  lightEnd:     0.65,
} as const

// Explosion point light parameters
export const LIGHT_MAX_INTENSITY = 80
export const LIGHT_DISTANCE      = 20   // world units, radius of influence
export const LIGHT_DECAY         = 2    // physically-based inverse-square
