import type { Vector3Tuple } from 'three'
import { EXPLOSION_ORIGIN } from '../explosionConfig'

// ─── Timing ──────────────────────────────────────────────────────────────────
// All values are seconds within a single cycle.
// Designed to follow the existing Phase 2 flash (peak at 0.08 s).

export const FIREBALL_START    = 0.08   // fireball begins forming
export const FIREBALL_PEAK     = 0.40   // maximum size
export const FIREBALL_END      = 1.55   // fully dissipated
export const FIREBALL_DURATION = FIREBALL_END - FIREBALL_START

// ─── Shape ───────────────────────────────────────────────────────────────────
export const FIREBALL_MAX_RADIUS   = 2.0   // world units at peak (center lobe)
export const FIREBALL_UPWARD_DRIFT = 0.85  // total upward travel over lifetime
export const FIREBALL_LOBE_COUNT   = 8

// ─── Noise / surface ─────────────────────────────────────────────────────────
export const NOISE_SCALE    = 1.0    // lower = chunkier, more rounded billows
export const NOISE_STRENGTH = 0.52  // vertex displacement magnitude (unit sphere)
export const NOISE_SPEED    = 0.75  // time scroll speed for noise animation

// ─── Color ramp (hottest → coldest) ──────────────────────────────────────────
// Values are linear RGB — the bloom pass amplifies the brightest regions.
export const COLOR_HOT:    Vector3Tuple = [1.00, 1.00, 0.90]  // white-hot core
export const COLOR_BRIGHT: Vector3Tuple = [1.00, 0.88, 0.12]  // bright yellow
export const COLOR_MID:    Vector3Tuple = [1.00, 0.40, 0.02]  // orange
export const COLOR_COOL:   Vector3Tuple = [0.55, 0.10, 0.00]  // deep orange-red
export const COLOR_DEAD:   Vector3Tuple = [0.12, 0.03, 0.00]  // dark ember

// ─── Lobe descriptors (deterministic — never call Math.random per frame) ─────
// Each lobe: position offset relative to EXPLOSION_ORIGIN, base scale factor,
// noise seed offset, start delay (s), expansion rate multiplier,
// depth factor (1=front/bright, 0.6=rear/dim), erosion threshold (0=solid,
// 0.52=heavily carved), and blending role.
//
// Blending split:
//   isCore = true  → AdditiveBlending, very low alpha — provides the central glow
//   isCore = false → NormalBlending, erosion via discard — fire body structure

interface LobeDesc {
  offset:           Vector3Tuple
  baseScale:        number
  seed:             number
  delay:            number   // seconds after FIREBALL_START
  expansionRate:    number   // multiplier on the base expansion curve
  depth:            number   // brightness scale: 1.0=front, 0.60=rear
  erosionThreshold: number   // 0.0=solid, 0.52=heavily carved
  isCore:           boolean
}

export const LOBE_DESCRIPTORS: LobeDesc[] = [
  // Core glow — additive, small, anchors the mass, minimal erosion
  { offset: [ 0.00,  0.20,  0.00], baseScale: 0.62, seed:  0.00, delay: 0.00, expansionRate: 1.00, depth: 1.00, erosionThreshold: 0.05, isCore: true  },
  // Right burst — front, bright, medium erosion, violent early ejection
  { offset: [ 1.05,  0.55, -0.25], baseScale: 0.62, seed:  1.31, delay: 0.02, expansionRate: 1.20, depth: 0.92, erosionThreshold: 0.28, isCore: false },
  // Left-mid — sideways mass, medium depth
  { offset: [-0.80,  0.65,  0.55], baseScale: 0.58, seed:  2.73, delay: 0.04, expansionRate: 0.92, depth: 0.78, erosionThreshold: 0.36, isCore: false },
  // Dominant upward plume — vertical protrusion, wispy top
  { offset: [ 0.25,  1.40, -0.15], baseScale: 0.52, seed:  4.17, delay: 0.06, expansionRate: 0.87, depth: 0.82, erosionThreshold: 0.42, isCore: false },
  // Right-low — breaks dome base, front-side mass
  { offset: [ 0.85,  0.32, -0.70], baseScale: 0.56, seed:  5.51, delay: 0.03, expansionRate: 1.14, depth: 0.88, erosionThreshold: 0.32, isCore: false },
  // Upper-left — rear, dimmer, heavier erosion
  { offset: [-0.95,  0.82,  0.15], baseScale: 0.50, seed:  6.89, delay: 0.05, expansionRate: 1.07, depth: 0.62, erosionThreshold: 0.46, isCore: false },
  // Back-left — deep rear, dim, very eroded for visible gaps
  { offset: [-0.55,  0.42, -0.95], baseScale: 0.48, seed:  8.33, delay: 0.07, expansionRate: 0.94, depth: 0.60, erosionThreshold: 0.52, isCore: false },
  // High-trailing — late, wispy dissipating upper lobe
  { offset: [ 0.48,  1.25,  0.60], baseScale: 0.46, seed:  9.71, delay: 0.08, expansionRate: 1.10, depth: 0.68, erosionThreshold: 0.50, isCore: false },
]

// Normalised origin for the whole fireball group (same as shared explosion origin)
export const FIREBALL_ORIGIN: Vector3Tuple = EXPLOSION_ORIGIN

/**
 * Returns the normalised lobe scale [0, 1+] at a given normalised lobe life.
 * Fast violent pop, brief overshoot plateau, then accelerating collapse.
 * Called in JS (useFrame), NOT inside GLSL.
 */
export function lobeScaleCurve(life: number): number {
  if (life <= 0) return 0
  if (life < 0.12) return life / 0.12                          // violent pop
  if (life < 0.32) return 1.0 + (life - 0.12) * 0.18         // brief overshoot plateau
  if (life < 0.60) return 1.036 - (life - 0.32) * 0.06       // slow decay begins
  return 1.019 - (life - 0.60) * 2.0 * (life - 0.60)         // accelerating collapse
}
