import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { FogExp2 } from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { usePerformanceTier } from '../../hooks/usePerformanceTier'
import { QUALITY_CONFIGS } from '../../lib/three/performanceConfig'
import ExplosionScene from '../../vfx/ExplosionScene'

// Sets the camera's initial orientation once on first frame.
// CameraShake in ExplosionScene handles per-frame position perturbation.
function CameraSetup() {
  const { camera } = useThree()
  const done = useRef(false)

  useFrame(() => {
    if (done.current) return
    camera.position.set(-0.5, 2.8, 9.5)
    camera.lookAt(1.8, 0.2, -1.5)
    done.current = true
  })

  return null
}

export default function HeroScene() {
  const reducedMotion = useReducedMotion()
  const tier          = usePerformanceTier()
  const dprMax        = QUALITY_CONFIGS[tier].dprMax

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

  const enablePostProcessing = QUALITY_CONFIGS[tier].enablePostProcessing && !reducedMotion

  return (
    <Canvas
      camera={{ fov: 55, near: 0.1, far: 60, position: [-0.5, 2.8, 9.5] }}
      dpr={[1, dprMax] as [number, number]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      frameloop={frameloop}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x08080a, 1)
        scene.fog = new FogExp2(0x08080a, 0.038)
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <CameraSetup />
      <ExplosionScene
        paused={reducedMotion}
        enablePostProcessing={enablePostProcessing}
        tier={tier}
      />
    </Canvas>
  )
}
