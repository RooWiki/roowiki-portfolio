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
import { sharpEnvelope } from './ExplosionTimeline'

interface Props {
  clockRef: { current: number }
  cycleDuration: number
}

export function ExplosionLight({ clockRef, cycleDuration }: Props) {
  const lightRef = useRef<PointLight>(null)

  useFrame(() => {
    if (!lightRef.current) return
    const t = clockRef.current % cycleDuration

    const e = sharpEnvelope(t, TIMING.lightPeak, TIMING.lightEnd)
    lightRef.current.intensity = e * LIGHT_MAX_INTENSITY

    // Color: white-hot at peak, shifts toward warm orange as it fades.
    // Calculated without allocation — setRGB mutates the existing Color.
    const decay = t > TIMING.lightPeak
      ? Math.min((t - TIMING.lightPeak) / (TIMING.lightEnd - TIMING.lightPeak), 1)
      : 0
    lightRef.current.color.setRGB(
      1.0,
      Math.max(0.35, 1.0 - decay * 0.55),
      Math.max(0.0,  0.85 - decay * 0.85),
    )
  })

  return (
    <pointLight
      ref={lightRef}
      position={EXPLOSION_ORIGIN}
      intensity={0}
      distance={LIGHT_DISTANCE}
      decay={LIGHT_DECAY}
      color="white"
    />
  )
}
