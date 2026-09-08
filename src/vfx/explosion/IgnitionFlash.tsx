import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, type Mesh, type MeshBasicMaterial } from 'three'
import { EXPLOSION_ORIGIN, TIMING } from './explosionConfig'
import { sharpEnvelope, envelope } from './ExplosionTimeline'

// Pre-allocated colors — mutated in place each frame, no garbage.
const _white  = new Color('#ffffff')
const _yellow = new Color('#fffaaa')
const _orange = new Color('#ff6600')
const _c      = new Color()

interface Props {
  clockRef: { current: number }
  cycleDuration: number
}

export function IgnitionFlash({ clockRef, cycleDuration }: Props) {
  // Separate mesh + material refs so we update scale and color independently.
  const coreMesh = useRef<Mesh>(null)
  const coreMat  = useRef<MeshBasicMaterial>(null)

  const glowMesh = useRef<Mesh>(null)
  const glowMat  = useRef<MeshBasicMaterial>(null)

  const bloomMesh = useRef<Mesh>(null)
  const bloomMat  = useRef<MeshBasicMaterial>(null)

  useFrame(() => {
    const t = clockRef.current % cycleDuration

    // ── Core: tiny opaque sphere, sharp white pulse ──────────────────────────
    const coreE = sharpEnvelope(t, TIMING.ignitionPeak, TIMING.ignitionEnd)
    if (coreMesh.current && coreMat.current) {
      coreMesh.current.scale.setScalar(coreE * 0.28)
      // White → yellow as core decays
      const colorT = t > TIMING.ignitionPeak
        ? Math.min((t - TIMING.ignitionPeak) / (TIMING.ignitionEnd - TIMING.ignitionPeak), 1)
        : 0
      _c.lerpColors(_white, _yellow, colorT)
      coreMat.current.color.copy(_c)
    }

    // ── Inner glow: warm mid-radius, additive blending ───────────────────────
    const glowE = envelope(t, TIMING.flashPeak, TIMING.flashEnd)
    if (glowMesh.current && glowMat.current) {
      glowMesh.current.scale.setScalar(glowE * 1.4)
      glowMat.current.opacity = glowE * 0.80
      // Yellow → orange
      const colorT = t > TIMING.flashPeak
        ? Math.min((t - TIMING.flashPeak) / (TIMING.flashEnd - TIMING.flashPeak), 1)
        : 0
      _c.lerpColors(_yellow, _orange, colorT)
      glowMat.current.color.copy(_c)
    }

    // ── Outer bloom approximation: large, very transparent, additive ─────────
    const bloomE = envelope(t, 0.035, TIMING.bloomEnd)
    if (bloomMesh.current && bloomMat.current) {
      bloomMesh.current.scale.setScalar(bloomE * 3.2)
      bloomMat.current.opacity = bloomE * 0.28
    }
  })

  return (
    <group position={EXPLOSION_ORIGIN}>
      {/* Core — opaque, tight, white/yellow */}
      <mesh ref={coreMesh} scale={0}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial ref={coreMat} color="white" />
      </mesh>

      {/* Inner glow — warm, additive, medium radius */}
      <mesh ref={glowMesh} scale={0}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial
          ref={glowMat}
          color="#fffaaa"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer bloom ring — large, very faint, additive */}
      <mesh ref={bloomMesh} scale={0}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          ref={bloomMat}
          color="#ff5500"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
