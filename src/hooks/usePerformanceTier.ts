import { useMemo } from 'react'
import type { QualityTier } from '../lib/three/performanceConfig'

export function usePerformanceTier(): QualityTier {
  return useMemo<QualityTier>(() => {
    const isMobile =
      /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
      window.innerWidth < 768

    if (isMobile) return 'low'

    const cores = navigator.hardwareConcurrency ?? 4
    if (cores <= 4) return 'medium'
    return 'high'
  }, [])
}
