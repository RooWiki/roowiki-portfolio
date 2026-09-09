import type { Vector3Tuple } from 'three'

// Single authoritative world-space origin for all explosion systems.
export const EXPLOSION_ORIGIN: Vector3Tuple = [2.2, 0.0, -1.5]

// 15-second cycle: one explosive event (~7s active) + ~8s residual/idle.
export const CYCLE_DURATION = 15.0

// ─── Master timeline (seconds from cycle start) ───────────────────────────────
export const TIMING = {
  // Ignition flash
  ignitionPeak: 0.05,
  ignitionEnd:  0.18,
  flashPeak:    0.04,
  flashEnd:     0.25,

  // Point light — brief, intense, wider radius
  lightPeak: 0.08,
  lightEnd:  0.35,

  // Shockwave
  shockwaveStart: 0.04,
  shockwaveEnd:   0.38,

  // Camera shake
  shakeStart: 0.03,
  shakeEnd:   0.70,
  shakePeak:  0.06,

  // Sparks / embers — extended for lingering embers
  sparksStart: 0.08,
  sparksEnd:   3.50,

  // Debris chunks
  debrisStart: 0.08,
  debrisEnd:   2.00,

  // Ground dust burst
  dustStart: 0.10,
  dustEnd:   1.80,

  // Smoke — starts earlier (overlaps with fireball for natural transition)
  smokeStart: 0.18,
  smokeEnd:   8.50,

  // Scorch mark (fades in, stays resident through entire aftermath)
  scorchStart: 0.35,
  scorchEnd:   14.50,
} as const

// ─── Explosion point light ────────────────────────────────────────────────────
export const LIGHT_MAX_INTENSITY = 22   // stronger impact moment
export const LIGHT_DISTANCE      = 14   // wider illumination radius
export const LIGHT_DECAY         = 2
