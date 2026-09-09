export type QualityTier = 'high' | 'medium' | 'low'

export interface QualityConfig {
  dprMax: number
  particleCount: number
  enableDistortion: boolean
  enablePostProcessing: boolean
}

export const QUALITY_CONFIGS: Record<QualityTier, QualityConfig> = {
  high: {
    dprMax: 1.5,
    particleCount: 5000,
    enableDistortion: true,
    enablePostProcessing: true,
  },
  medium: {
    dprMax: 1.5,
    particleCount: 1000,
    enableDistortion: false,
    enablePostProcessing: false,
  },
  low: {
    dprMax: 1,
    particleCount: 200,
    enableDistortion: false,
    enablePostProcessing: false,
  },
}
