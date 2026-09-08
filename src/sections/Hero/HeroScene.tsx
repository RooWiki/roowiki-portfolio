import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { usePerformanceTier } from '../../hooks/usePerformanceTier'
import { QUALITY_CONFIGS } from '../../lib/three/performanceConfig'

interface SceneContentProps {
  paused: boolean
}

function SceneContent({ paused }: SceneContentProps) {
  const torusRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    if (paused || !torusRef.current) return
    torusRef.current.rotation.z += delta * 0.12
    torusRef.current.rotation.x += delta * 0.04
  })

  return (
    <mesh ref={torusRef} rotation={[Math.PI / 3.5, 0, 0] as const}>
      <torusGeometry args={[3, 0.045, 8, 128] as const} />
      <meshBasicMaterial color="#e05c00" />
    </mesh>
  )
}

export default function HeroScene() {
  const reducedMotion = useReducedMotion()
  const tier = usePerformanceTier()
  const dprMax = QUALITY_CONFIGS[tier].dprMax

  const [tabHidden, setTabHidden] = useState(() => document.hidden)

  useEffect(() => {
    const handler = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [])

  const frameloop: 'always' | 'demand' | 'never' = reducedMotion
    ? 'demand'
    : tabHidden
      ? 'never'
      : 'always'

  return (
    <Canvas
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 8] as const }}
      dpr={[1, dprMax] as [number, number]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      frameloop={frameloop}
      onCreated={({ gl }) => gl.setClearColor(0x08080a, 1)}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <SceneContent paused={reducedMotion} />
    </Canvas>
  )
}
