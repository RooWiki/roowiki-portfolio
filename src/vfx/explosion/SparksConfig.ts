import type { QualityTier } from '../../lib/three/performanceConfig'
import { TIMING } from './explosionConfig'

export const SPARKS_START    = TIMING.sparksStart
export const SPARKS_END      = TIMING.sparksEnd
export const SPARKS_DURATION = SPARKS_END - SPARKS_START

// Particle counts per quality tier
export const SPARKS_COUNT: Record<QualityTier, number> = {
  high:   3500,
  medium: 1800,
  low:    700,
}

// Physics
export const SPARKS_GRAVITY      = 4.8   // slightly heavier fall
export const SPARKS_SPEED_MIN    = 1.8
export const SPARKS_SPEED_MAX    = 10.5  // fast streaking sparks for radial burst impact

// Lifetime: wide range creates fast sparks + long-dying embers
export const SPARKS_LIFETIME_MIN = 0.25
export const SPARKS_LIFETIME_MAX = 2.80

// Upward bias: stronger hemisphere bias
export const SPARKS_UPWARD_BIAS = 0.65

// Point rendering: wide range — a few bright large sparks stand out
export const SPARKS_SIZE_MIN = 1.8
export const SPARKS_SIZE_MAX = 7.0
