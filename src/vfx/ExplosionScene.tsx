import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { VfxEnvironment } from './environment/VfxEnvironment'
import { IgnitionFlash } from './explosion/IgnitionFlash'
import { ExplosionLight } from './explosion/ExplosionLight'
import { CYCLE_DURATION } from './explosion/explosionConfig'

// Future modules (fireball, smoke, sparks, debris, shockwave, ground dust,
// heat distortion, scorch, camera shake) will be added here as siblings,
// each consuming the same clockRef and cycleDuration.

interface Props {
  paused: boolean
}

export default function ExplosionScene({ paused }: Props) {
  // Master elapsed clock — a plain ref, never written to React state.
  // All child VFX systems read this to derive their own cycle time.
  const elapsedRef = useRef(0)

  useFrame((_state, delta) => {
    if (!paused) {
      elapsedRef.current += delta
    }
  })

  return (
    <>
      <VfxEnvironment />
      <IgnitionFlash clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />
      <ExplosionLight clockRef={elapsedRef} cycleDuration={CYCLE_DURATION} />
    </>
  )
}
