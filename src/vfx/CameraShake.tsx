import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { TIMING } from './explosion/explosionConfig'
import { sharpEnvelope } from './explosion/ExplosionTimeline'

const SHAKE_MAGNITUDE = 0.082  // stronger initial impulse
const SHAKE_FREQUENCY = 30.0   // primary oscillation frequency

// Pre-allocated reusable vectors — zero allocation per frame
const _base = new Vector3(-0.5, 2.8, 9.5)   // matches CameraSetup initial position
const _off  = new Vector3()

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
}

export function CameraShake({ clockRef, cycleDuration }: Props) {
  const { camera } = useThree()

  // Prevent shake on the very first frame before the first cycle event
  const firstCycleRef = useRef(true)
  const prevCycleRef  = useRef(-1)

  useFrame(() => {
    const elapsed = clockRef.current
    const t       = elapsed % cycleDuration

    // Detect cycle restart to allow shake to re-trigger
    const cycle = Math.floor(elapsed / cycleDuration)
    if (cycle !== prevCycleRef.current) {
      prevCycleRef.current = cycle
      firstCycleRef.current = false
    }

    if (firstCycleRef.current) {
      camera.position.copy(_base)
      return
    }

    const sysT    = t - TIMING.shakeStart
    const dur     = TIMING.shakeEnd - TIMING.shakeStart
    const envelope = sharpEnvelope(sysT, TIMING.shakePeak - TIMING.shakeStart, dur)

    if (envelope <= 0.001) {
      camera.position.copy(_base)
      return
    }

    // Primary impulse + secondary lower-frequency vibration
    const magnitude = envelope * SHAKE_MAGNITUDE
    const phase     = t * SHAKE_FREQUENCY
    // Secondary vibration at ~1/3 frequency adds the "settling" feel
    const phase2    = t * 9.0
    _off.set(
      Math.sin(phase  * 1.00) * magnitude       + Math.sin(phase2 * 1.00) * magnitude * 0.22,
      Math.sin(phase  * 0.83) * magnitude * 0.55 + Math.sin(phase2 * 0.70) * magnitude * 0.14,
      Math.sin(phase  * 1.28) * magnitude * 0.28,
    )
    camera.position.copy(_base).add(_off)
  })

  return null
}
