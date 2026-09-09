import { useRef } from 'react'
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

// Internal switch: set false to restore the legacy Fireball+Smoke+Shockwave systems.
// Not exposed in any UI.
const USE_VOLUMETRIC = true

// Legacy imports — kept available for fallback, tree-shaken when USE_VOLUMETRIC=true
// because they are inside the conditional below.
import { Fireball } from './explosion/Fireball/Fireball'
import { Shockwave } from './explosion/Shockwave'
import { Smoke } from './explosion/Smoke'

interface Props {
  paused:               boolean
  enablePostProcessing: boolean
  tier:                 QualityTier
}

export default function ExplosionScene({ paused, enablePostProcessing, tier }: Props) {
  const elapsedRef = useRef(0)

  useFrame((_state, delta) => {
    if (!paused) {
      elapsedRef.current += delta
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
