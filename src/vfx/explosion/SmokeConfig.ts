import type { QualityTier } from '../../lib/three/performanceConfig'
import { EXPLOSION_ORIGIN, TIMING } from './explosionConfig'
import type { Vector3Tuple } from 'three'

export const SMOKE_START    = TIMING.smokeStart
export const SMOKE_END      = TIMING.smokeEnd
export const SMOKE_DURATION = SMOKE_END - SMOKE_START

export const SMOKE_PUFF_COUNT: Record<QualityTier, number> = {
  high:   32,
  medium: 18,
  low:    8,
}

export interface SmokePuff {
  birthOffset:  number
  lifetime:     number
  initPos:      Vector3Tuple
  riseSpeed:    number
  driftX:       number
  driftZ:       number
  baseScale:    number
  maxScale:     number
  seed:         number
  rotSpeed:     number
}

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function buildPuffs(n: number, tierSeed: number): SmokePuff[] {
  const rng    = seededRng(13 + tierSeed)
  const puffs: SmokePuff[] = []

  for (let i = 0; i < n; i++) {
    const angle  = rng() * Math.PI * 2
    // Wider spawn radius so puffs emerge from the whole fire base
    const radius = rng() * 1.2
    puffs.push({
      // Stagger births over 2s — early puffs overlap fire for natural transition
      birthOffset: rng() * 2.0,
      // Longer lifetime for persistent mass; variation creates overlap
      lifetime:    4.0 + rng() * 4.0,
      initPos:     [
        EXPLOSION_ORIGIN[0] + Math.cos(angle) * radius,
        EXPLOSION_ORIGIN[1] + 0.6 + rng() * 1.2,
        EXPLOSION_ORIGIN[2] + Math.sin(angle) * radius,
      ],
      // Faster rise speed for dramatic upward momentum
      riseSpeed: 0.9 + rng() * 2.0,
      // More drift asymmetry so column doesn't rise perfectly straight
      driftX:    (rng() - 0.5) * 0.55,
      driftZ:    (rng() - 0.5) * 0.55,
      // Much larger puff sizes — overlapping creates volumetric mass
      baseScale: 1.4 + rng() * 0.8,
      maxScale:  6.0 + rng() * 6.0,
      seed:      rng(),
      rotSpeed:  (rng() - 0.5) * 0.45,
    })
  }
  return puffs
}

const _puffCache = new Map<QualityTier, SmokePuff[]>()

export function getSmokePuffs(tier: QualityTier): SmokePuff[] {
  if (_puffCache.has(tier)) return _puffCache.get(tier)!
  const tierSeed = tier === 'high' ? 0 : tier === 'medium' ? 1 : 2
  const puffs    = buildPuffs(SMOKE_PUFF_COUNT[tier], tierSeed)
  _puffCache.set(tier, puffs)
  return puffs
}
