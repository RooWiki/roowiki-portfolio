import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom, wrapEffect } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'
import { Vector3 } from 'three'
import type { QualityTier } from '../lib/three/performanceConfig'
import { HeatDistortionEffect } from './HeatDistortion'
import { EXPLOSION_ORIGIN, TIMING } from './explosion/explosionConfig'

const HeatDistortion = wrapEffect(HeatDistortionEffect)

// Shockwave: expands 0 → MAX_RADIUS over the shockwave window.
// In screen-space UV distance (not world units), so scale relative to canvas.
const SW_UV_MAX_RADIUS = 0.38   // UV-space radius at full expansion
const SW_PEAK_STRENGTH = 0.014  // peak UV distortion magnitude

// Pre-allocated scratch — zero allocation per frame
const _v = new Vector3()

interface Props {
  tier:          QualityTier
  clockRef:      { current: number }
  cycleDuration: number
}

export function PostFx({ tier, clockRef, cycleDuration }: Props) {
  const kernelSize = tier === 'high' ? KernelSize.LARGE : KernelSize.MEDIUM
  const enableHeat = tier === 'high'
  const heatRef    = useRef<HeatDistortionEffect>(null)

  useFrame(({ camera }) => {
    if (!enableHeat || !heatRef.current) return

    const t        = clockRef.current % cycleDuration
    const fireAge  = t - TIMING.sparksStart

    // ── Heat haze strength ────────────────────────────────────────────────────
    let strength = 0
    if (fireAge > 0 && fireAge < 2.0) {
      const rise  = Math.min(fireAge / 0.15, 1.0)
      const decay = Math.max(0, 1.0 - fireAge / 2.0)
      strength    = rise * decay * 0.0035
    }

    // ── Project explosion origin to screen-space UV ───────────────────────────
    _v.set(...EXPLOSION_ORIGIN).project(camera)
    const cx = (_v.x + 1) / 2
    const cy = 1 - (_v.y + 1) / 2

    const u = heatRef.current.uniforms

    const uCenter = u.get('uCenter')
    if (uCenter) {
      const cv = uCenter.value as { x: number; y: number }
      cv.x = cx
      cv.y = cy
    }

    const uTime = u.get('uTime')
    if (uTime) uTime.value = t

    const uStrength = u.get('uStrength')
    if (uStrength) uStrength.value = strength

    // ── Shockwave ring ────────────────────────────────────────────────────────
    const swAge = t - TIMING.shockwaveStart
    const swDur = TIMING.shockwaveEnd - TIMING.shockwaveStart

    let swRadius   = 0
    let swStrength = 0

    if (swAge > 0 && swAge < swDur) {
      const prog = swAge / swDur
      swRadius   = SW_UV_MAX_RADIUS * Math.sqrt(prog)  // faster early expansion
      // Spike at onset then decay
      const spike = Math.min(swAge / 0.03, 1.0)
      const decay = Math.max(0, 1.0 - swAge / swDur)
      swStrength  = spike * decay * decay * SW_PEAK_STRENGTH
    }

    const uSWRadius = u.get('uShockwaveRadius')
    if (uSWRadius) uSWRadius.value = swRadius

    const uSWMax = u.get('uShockwaveMaxRadius')
    if (uSWMax) uSWMax.value = SW_UV_MAX_RADIUS

    const uSWStrength = u.get('uShockwaveStrength')
    if (uSWStrength) uSWStrength.value = swStrength
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
