import { useState, useCallback, useRef } from 'react'
import { usePerformanceTier } from './usePerformanceTier'
import type { QualityTier } from '../lib/three/performanceConfig'

// FPS thresholds below which a downgrade is triggered for each tier.
const THRESHOLDS: Record<QualityTier, number> = { high: 40, medium: 25, low: 0 }

// Number of consecutive low-FPS measurements before downgrading.
// Each measurement fires ~once per second (every 60 frames at 60 FPS).
const GRACE_TICKS = 5

const DOWNGRADE: Record<QualityTier, QualityTier> = {
  high:   'medium',
  medium: 'low',
  low:    'low',
}

export function useAdaptiveTier(): { tier: QualityTier; onFps: (fps: number) => void } {
  const base = usePerformanceTier()
  const [tier, setTier] = useState<QualityTier>(base)
  const lowCount = useRef(0)

  // Include tier in deps so the callback always reads the current tier.
  // onFps is recreated only on tier changes (infrequent), which is fine.
  const onFps = useCallback((fps: number) => {
    if (tier === 'low') return

    if (fps < THRESHOLDS[tier]) {
      lowCount.current++
      if (lowCount.current >= GRACE_TICKS) {
        lowCount.current = 0
        setTier(DOWNGRADE[tier])
      }
    } else {
      lowCount.current = 0
    }
  }, [tier])

  return { tier, onFps }
}
