import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, wrapEffect } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { Vector3 } from 'three'
import type { QualityTier } from '../lib/three/performanceConfig'
import { HeatDistortionEffect } from './HeatDistortion'
import { EXPLOSION_ORIGIN, TIMING } from './explosion/explosionConfig'

const HeatDistortion = wrapEffect(HeatDistortionEffect)

// Pre-allocated reusable vector — zero allocation per frame
const _v = new Vector3()

interface Props {
  tier:          QualityTier
  clockRef:      { current: number }
  cycleDuration: number
}

export function PostFx({ tier, clockRef, cycleDuration }: Props) {
  const kernelSize    = tier === 'high' ? KernelSize.LARGE : KernelSize.MEDIUM
  const enableHeat    = tier === 'high'
  const heatRef       = useRef<HeatDistortionEffect>(null)

  useFrame(({ camera }) => {
    if (!enableHeat || !heatRef.current) return

    const t        = clockRef.current % cycleDuration
    const fireAge  = t - TIMING.sparksStart

    // Strength: rises during fireball, decays by 2s, zero outside that window
    let strength = 0
    if (fireAge > 0 && fireAge < 2.0) {
      const rise  = Math.min(fireAge / 0.15, 1.0)
      const decay = Math.max(0, 1.0 - fireAge / 2.0)
      strength    = rise * decay * 0.0035
    }

    _v.set(...EXPLOSION_ORIGIN).project(camera)
    const cx = (_v.x + 1) / 2
    const cy = 1 - (_v.y + 1) / 2   // three.js NDC Y is inverted vs UV

    const uCenter = heatRef.current.uniforms.get('uCenter')
    if (uCenter) {
      const cv = uCenter.value as { x: number; y: number }
      cv.x = cx
      cv.y = cy
    }

    const uTime = heatRef.current.uniforms.get('uTime')
    if (uTime) uTime.value = t

    const uStrength = heatRef.current.uniforms.get('uStrength')
    if (uStrength) uStrength.value = strength
  })

  return (
    <EffectComposer enableNormalPass={false}>
      {enableHeat && <HeatDistortion ref={heatRef} />}
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.58}
        luminanceSmoothing={0.28}
        kernelSize={kernelSize}
      />
    </EffectComposer>
  )
}
