import type { QualityTier } from '../../../lib/three/performanceConfig'
import { EXPLOSION_ORIGIN } from '../explosionConfig'
import type { Vector3Tuple } from 'three'

// ─── Timing ──────────────────────────────────────────────────────────────────
export const VOL_START        = 0.06   // begins just before fireball peak
export const VOL_FIRE_END     = 2.20   // fire phase ends
export const VOL_SMOKE_END    = 9.00   // smoke fades out
export const VOL_DURATION     = VOL_SMOKE_END - VOL_START

// ─── Spatial ─────────────────────────────────────────────────────────────────
export const VOL_ORIGIN: Vector3Tuple = [
  EXPLOSION_ORIGIN[0],
  EXPLOSION_ORIGIN[1],
  EXPLOSION_ORIGIN[2],
]

// Maximum world-space extents: must encompass fire + smoke column
export const VOL_RADIUS_MAX  = 3.8   // XZ half-extent at peak
export const VOL_HEIGHT_MAX  = 9.0   // Y extent above origin at peak smoke
export const VOL_RISE_SPEED  = 0.70  // world units per second for rising center

// ─── Quality: raymarch steps ─────────────────────────────────────────────────
export const MARCH_STEPS: Record<QualityTier, number> = {
  high:   96,
  medium: 64,
  low:    32,
}

// ─── Quality: FBM octaves ─────────────────────────────────────────────────────
export const NOISE_OCTAVES: Record<QualityTier, number> = {
  high:   4,
  medium: 3,
  low:    2,
}
