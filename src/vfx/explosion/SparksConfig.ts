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
export const SPARKS_GRAVITY      = 4.2   // m/s² downward
export const SPARKS_SPEED_MIN    = 2.0
export const SPARKS_SPEED_MAX    = 6.8
export const SPARKS_LIFETIME_MIN = 0.30
export const SPARKS_LIFETIME_MAX = 1.80

// Upward bias: sparks are biased into the upper hemisphere
export const SPARKS_UPWARD_BIAS = 0.55

// Point rendering
export const SPARKS_SIZE_MIN = 2.0   // pixels at full scale
export const SPARKS_SIZE_MAX = 4.5
