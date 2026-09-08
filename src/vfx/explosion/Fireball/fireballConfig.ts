import type { Vector3Tuple } from 'three'
import { EXPLOSION_ORIGIN } from '../explosionConfig'

// ─── Timing ──────────────────────────────────────────────────────────────────
export const FIREBALL_START    = 0.08
export const FIREBALL_PEAK     = 0.35
export const FIREBALL_END      = 1.85
export const FIREBALL_DURATION = FIREBALL_END - FIREBALL_START

// ─── Shape ───────────────────────────────────────────────────────────────────
// Larger radius creates an imposing visual mass; diverse baseScales create
// large-medium-small hierarchy instead of uniform blobs.
export const FIREBALL_MAX_RADIUS   = 2.8   // world units at peak (dominant lobe)
export const FIREBALL_UPWARD_DRIFT = 1.25  // total upward travel over lifetime
export const FIREBALL_LOBE_COUNT   = 8

// ─── Noise / surface ─────────────────────────────────────────────────────────
// Lower NOISE_SCALE = chunkier, more rounded billows (less high-freq grain).
// Higher NOISE_STRENGTH = dramatic vertex displacement, visible breakup.
export const NOISE_SCALE    = 0.82   // lower = chunkier / rounder
export const NOISE_STRENGTH = 0.68   // stronger surface displacement
export const NOISE_SPEED    = 0.75

// ─── Color ramp (hottest → coldest) ──────────────────────────────────────────
export const COLOR_HOT:    Vector3Tuple = [1.00, 1.00, 0.92]  // white-hot core
export const COLOR_BRIGHT: Vector3Tuple = [1.00, 0.85, 0.08]  // bright yellow
export const COLOR_MID:    Vector3Tuple = [1.00, 0.38, 0.01]  // dominant orange
export const COLOR_COOL:   Vector3Tuple = [0.60, 0.08, 0.00]  // deep red-orange
export const COLOR_DEAD:   Vector3Tuple = [0.10, 0.02, 0.00]  // dark ember

// ─── Lobe descriptors ────────────────────────────────────────────────────────
// Size hierarchy: large dominant lobes + medium masses + small peripheral bursts.
// Asymmetric offsets prevent hemispherical silhouette.
// Secondary lobes use delay > 0.09 to simulate secondary ignition bursts.
//
// Blending split:
//   isCore = true  → AdditiveBlending, low alpha — central accumulation glow
//   isCore = false → NormalBlending, erosion via discard — fire body structure

interface LobeDesc {
  offset:           Vector3Tuple
  baseScale:        number
  seed:             number
  delay:            number
  expansionRate:    number
  depth:            number
  erosionThreshold: number
  isCore:           boolean
}

export const LOBE_DESCRIPTORS: LobeDesc[] = [
  // Core glow — additive, anchors central mass, minimal erosion
  { offset: [ 0.00,  0.35,  0.00], baseScale: 0.75, seed:  0.00, delay: 0.00, expansionRate: 1.00, depth: 1.00, erosionThreshold: 0.04, isCore: true  },

  // RIGHT dominant burst — hero lobe, largest, violent early ejection
  { offset: [ 1.20,  0.60, -0.35], baseScale: 0.88, seed:  1.31, delay: 0.02, expansionRate: 1.18, depth: 0.94, erosionThreshold: 0.24, isCore: false },

  // LEFT large mass — major balancing mass, medium erosion
  { offset: [-1.05,  0.75,  0.40], baseScale: 0.80, seed:  2.73, delay: 0.04, expansionRate: 0.90, depth: 0.80, erosionThreshold: 0.32, isCore: false },

  // UPPER PLUME — dominant vertical protrusion, wispy eroded top
  { offset: [ 0.30,  1.70, -0.20], baseScale: 0.68, seed:  4.17, delay: 0.06, expansionRate: 0.86, depth: 0.84, erosionThreshold: 0.40, isCore: false },

  // RIGHT-LOW forward burst — breaks dome base, front-side mass
  { offset: [ 0.90,  0.22, -0.85], baseScale: 0.72, seed:  5.51, delay: 0.03, expansionRate: 1.14, depth: 0.90, erosionThreshold: 0.28, isCore: false },

  // UPPER-LEFT secondary — slightly delayed, rear-mid depth
  { offset: [-1.15,  0.95,  0.18], baseScale: 0.63, seed:  6.89, delay: 0.11, expansionRate: 1.04, depth: 0.65, erosionThreshold: 0.44, isCore: false },

  // BACK-DEPTH layer — deep rear, creates visual depth, heavily eroded
  { offset: [-0.48,  0.48, -1.15], baseScale: 0.55, seed:  8.33, delay: 0.07, expansionRate: 0.95, depth: 0.62, erosionThreshold: 0.52, isCore: false },

  // RIGHT-HIGH secondary burst — delayed, simulates secondary ignition
  { offset: [ 0.70,  1.45,  0.42], baseScale: 0.58, seed:  9.71, delay: 0.14, expansionRate: 1.09, depth: 0.70, erosionThreshold: 0.48, isCore: false },
]

export const FIREBALL_ORIGIN: Vector3Tuple = EXPLOSION_ORIGIN

/**
 * Normalised lobe scale at a given normalised lobe life.
 * More violent pop and higher overshoot than prototype version.
 */
export function lobeScaleCurve(life: number): number {
  if (life <= 0) return 0
  if (life < 0.10) return life / 0.10                           // violent pop (faster)
  if (life < 0.30) return 1.0 + (life - 0.10) * 0.40          // aggressive overshoot plateau → ~1.08
  if (life < 0.58) return 1.080 - (life - 0.30) * 0.08        // gradual decay
  return 1.058 - (life - 0.58) * 2.2 * (life - 0.58)          // accelerating collapse
}
