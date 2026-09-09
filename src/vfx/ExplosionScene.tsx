import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { QualityTier } from '../lib/three/performanceConfig'
import { VfxEnvironment } from './environment/VfxEnvironment'
import { IgnitionFlash } from './explosion/IgnitionFlash'
import { ExplosionLight } from './explosion/ExplosionLight'
import { VolumetricFire } from './explosion/VolumetricFire/VolumetricFire'
import { Sparks } from './explosion/Sparks'
import { SparkStreaks } from './explosion/SparkStreaks'
import { GroundDust } from './explosion/GroundDust'
import { Debris } from './explosion/Debris'
import { ScorchMark } from './explosion/ScorchMark'
import { CameraShake } from './CameraShake'
import { PostFx } from './PostFx'
import { CYCLE_DURATION } from './explosion/explosionConfig'
import { getDevVfxTime } from './devInspect'

// Internal switch: set false to restore the legacy Fireball+Smoke+Shockwave systems.
// Not exposed in any UI.
const USE_VOLUMETRIC = true

// Legacy imports — kept as fallback; tree-shaken when USE_VOLUMETRIC=true
import { Fireball } from './explosion/Fireball/Fireball'
import { Shockwave } from './explosion/Shockwave'
import { Smoke } from './explosion/Smoke'

// Clock starts 1 s before VFX ignition — calm window before the explosion.
const CLOCK_START = -1.0
// Stop just before the modulo wrap-point (15 % 15 = 0 would reset all VFX).
const CLOCK_END   = CYCLE_DURATION - 0.01

interface Props {
  paused:               boolean
  enablePostProcessing: boolean
  tier:                 QualityTier
  onCycleComplete?:     () => void
  // Increment to trigger a clock reset (replay)
  resetSignal?:         number
}

export default function ExplosionScene({
  paused,
  enablePostProcessing,
  tier,
  onCycleComplete,
  resetSignal,
}: Props) {
  // Dev-only: ?vfxTime=N freezes the clock at a specific second
  const devTime      = getDevVfxTime()

  const elapsedRef    = useRef(devTime !== null ? devTime : CLOCK_START)
  const notifiedRef   = useRef(false)
  const prevResetRef  = useRef(resetSignal ?? 0)

  // Reset clock when parent signals a replay
  useEffect(() => {
    if (resetSignal !== undefined && resetSignal !== prevResetRef.current) {
      prevResetRef.current   = resetSignal
      elapsedRef.current     = CLOCK_START
      notifiedRef.current    = false
    }
  }, [resetSignal])

  useFrame((_state, delta) => {
    // Dev time freeze: clock is held at the specified value
    if (devTime !== null) return

    if (paused) return
    if (elapsedRef.current >= CLOCK_END) return

    elapsedRef.current = Math.min(elapsedRef.current + delta, CLOCK_END)

    if (elapsedRef.current >= CLOCK_END && !notifiedRef.current) {
      notifiedRef.current = true
      onCycleComplete?.()
    }
  })

  return (
    <>
      <VfxEnvironment />
      <ScorchMark    clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />
      <IgnitionFlash clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />
      <ExplosionLight clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />

      {USE_VOLUMETRIC ? (
        <VolumetricFire clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
      ) : (
        <>
          <Shockwave clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />
          <Fireball  clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
          <Smoke     clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
        </>
      )}

      <GroundDust   clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
      <SparkStreaks  clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
      <Sparks       clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
      <Debris       clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} tier={tier} />
      <CameraShake  clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />

      {enablePostProcessing && (
        <PostFx tier={tier} clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />
      )}
    </>
  )
}
