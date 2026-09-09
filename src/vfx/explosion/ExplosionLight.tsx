import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PointLight } from 'three'
import {
  EXPLOSION_ORIGIN,
  TIMING,
  LIGHT_MAX_INTENSITY,
  LIGHT_DISTANCE,
  LIGHT_DECAY,
} from './explosionConfig'
import { sharpEnvelope, envelope } from './ExplosionTimeline'

// Afterglow: warm orange light that lingers through the fireball and deep into
// the smoke phase, illuminating the rising column from below.
const AFTERGLOW_INTENSITY = 6.0
const AFTERGLOW_DISTANCE  = 14
const AFTERGLOW_START     = 0.20  // begins rising with the fireball
const AFTERGLOW_PEAK      = 0.90  // full orange warmth
const AFTERGLOW_END       = 5.00  // fades well into the smoke phase

interface Props {
  clockRef: { current: number }
  cycleDuration: number
}

export function ExplosionLight({ clockRef, cycleDuration }: Props) {
  const burstRef    = useRef<PointLight>(null)
  const afterglowRef = useRef<PointLight>(null)

  useFrame(() => {
    const t = clockRef.current % cycleDuration

    // ── Burst light: white-hot peak, tight fast decay ────────────────────────
    if (burstRef.current) {
      const e = sharpEnvelope(t, TIMING.lightPeak, TIMING.lightEnd)
      burstRef.current.intensity = e * LIGHT_MAX_INTENSITY

      const decay = t > TIMING.lightPeak
        ? Math.min((t - TIMING.lightPeak) / (TIMING.lightEnd - TIMING.lightPeak), 1)
        : 0
      burstRef.current.color.setRGB(
        1.0,
        Math.max(0.35, 1.0 - decay * 0.55),
        Math.max(0.0,  0.85 - decay * 0.85),
      )
    }

    // ── Afterglow: warm orange, rises through fireball, lingers into smoke ───
    if (afterglowRef.current) {
      const tAg = t - AFTERGLOW_START
      const durAg = AFTERGLOW_END - AFTERGLOW_START
      const ag = tAg > 0
        ? envelope(tAg, AFTERGLOW_PEAK - AFTERGLOW_START, durAg) * AFTERGLOW_INTENSITY
        : 0
      afterglowRef.current.intensity = ag
      // Deep warm orange — represents residual fire heat below smoke
      afterglowRef.current.color.setRGB(1.0, 0.25, 0.00)
    }
  })

  return (
    <>
      {/* Main burst: white-hot detonation flash, no shadows (too brief to matter) */}
      <pointLight
        ref={burstRef}
        position={EXPLOSION_ORIGIN}
        intensity={0}
        distance={LIGHT_DISTANCE}
        decay={LIGHT_DECAY}
        color="white"
        castShadow={false}
      />
      {/* Afterglow: elevated warm-orange glow, illuminates smoke column from below */}
      <pointLight
        ref={afterglowRef}
        position={[EXPLOSION_ORIGIN[0], EXPLOSION_ORIGIN[1] + 1.4, EXPLOSION_ORIGIN[2]]}
        intensity={0}
        distance={AFTERGLOW_DISTANCE}
        decay={LIGHT_DECAY}
        color="#ff4000"
        castShadow={false}
      />
    </>
  )
}
