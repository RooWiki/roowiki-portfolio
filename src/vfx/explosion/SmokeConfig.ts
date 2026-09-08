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

// Each puff descriptor — deterministic, no Math.random per frame
export interface SmokePuff {
  birthOffset:  number     // seconds after SMOKE_START when puff is born
  lifetime:     number     // seconds the puff lives
  initPos:      Vector3Tuple
  riseSpeed:    number     // m/s vertical drift
  driftX:       number     // gentle horizontal drift
  driftZ:       number
  baseScale:    number     // starting world-space size
  maxScale:     number     // size at death
  seed:         number     // for shader noise variation
  rotSpeed:     number     // radians/s billboard rotation
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
    const radius = rng() * 0.8
    puffs.push({
      birthOffset: rng() * 2.0,                          // stagger births over 2s
      lifetime:    3.0 + rng() * 3.0,                    // 3–6s per puff
      initPos:     [
        EXPLOSION_ORIGIN[0] + Math.cos(angle) * radius,
        EXPLOSION_ORIGIN[1] + 0.5 + rng() * 0.8,        // start above ground
        EXPLOSION_ORIGIN[2] + Math.sin(angle) * radius,
      ],
      riseSpeed: 0.5 + rng() * 1.2,
      driftX:    (rng() - 0.5) * 0.3,
      driftZ:    (rng() - 0.5) * 0.3,
      baseScale: 0.8 + rng() * 0.6,
      maxScale:  3.5 + rng() * 2.5,
      seed:      rng(),
      rotSpeed:  (rng() - 0.5) * 0.4,
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
