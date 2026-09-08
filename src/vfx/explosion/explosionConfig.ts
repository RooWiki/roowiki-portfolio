import type { Vector3Tuple } from 'three'

// Single authoritative world-space origin for all explosion systems.
export const EXPLOSION_ORIGIN: Vector3Tuple = [2.2, 0.0, -1.5]

// 15-second cycle: one explosive event (~6s active) + ~9s residual/idle.
// Chosen to feel premium — not constantly repeating.
export const CYCLE_DURATION = 15.0

// ─── Master timeline (seconds from cycle start) ───────────────────────────────
export const TIMING = {
  // Ignition flash (Phase 2)
  ignitionPeak: 0.05,
  ignitionEnd:  0.18,
  flashPeak:    0.04,
  flashEnd:     0.25,

  // Point light
  lightPeak: 0.08,
  lightEnd:  0.55,

  // Shockwave
  shockwaveStart: 0.04,
  shockwaveEnd:   0.38,

  // Camera shake
  shakeStart: 0.03,
  shakeEnd:   0.70,
  shakePeak:  0.06,

  // Sparks / embers
  sparksStart: 0.08,
  sparksEnd:   2.80,

  // Debris chunks
  debrisStart: 0.08,
  debrisEnd:   1.80,

  // Ground dust burst
  dustStart: 0.12,
  dustEnd:   1.50,

  // Smoke column (starts after fireball, persists long)
  smokeStart: 0.25,
  smokeEnd:   8.00,

  // Scorch mark (fades in, stays resident)
  scorchStart: 0.40,
  scorchEnd:   13.00,
} as const

// ─── Explosion point light ────────────────────────────────────────────────────
export const LIGHT_MAX_INTENSITY = 14
export const LIGHT_DISTANCE      = 8    // tight radius — localized illumination
export const LIGHT_DECAY         = 2
