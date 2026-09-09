import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { FogExp2 } from 'three'
import { ENV_BG_HEX, ENV_FOG_DENSITY } from '../../vfx/environment/environmentConfig'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useAdaptiveTier } from '../../hooks/useAdaptiveTier'
import { QUALITY_CONFIGS } from '../../lib/three/performanceConfig'
import { DevPerfOverlay } from '../../vfx/devPerfHud'
import ExplosionScene from '../../vfx/ExplosionScene'

function CameraSetup() {
  const { camera } = useThree()
  const done = useRef(false)

  useFrame(() => {
    if (done.current) return
    camera.position.set(-0.5, 2.8, 9.5)
    camera.lookAt(2.0, 0.5, -1.5)
    done.current = true
  })

  return null
}

export default function HeroScene() {
  const reducedMotion    = useReducedMotion()
  const { tier, onFps } = useAdaptiveTier()
  const dprMax           = QUALITY_CONFIGS[tier].dprMax

  const [tabHidden,   setTabHidden]   = useState(() => document.hidden)
  const [showReplay,  setShowReplay]  = useState(false)
  const [resetSignal, setResetSignal] = useState(0)

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

  const handleCycleComplete = useCallback(() => {
    setShowReplay(true)
  }, [])

  const handleReplay = useCallback(() => {
    setResetSignal(s => s + 1)
    setShowReplay(false)
  }, [])

  return (
    <>
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 60, position: [-0.5, 2.8, 9.5] }}
        dpr={[1, dprMax] as [number, number]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        frameloop={frameloop}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(ENV_BG_HEX, 1)
          scene.fog = new FogExp2(ENV_BG_HEX, ENV_FOG_DENSITY)
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <CameraSetup />
        <ExplosionScene
          paused={reducedMotion}
          enablePostProcessing={enablePostProcessing}
          tier={tier}
          onCycleComplete={handleCycleComplete}
          onFps={onFps}
          resetSignal={resetSignal}
        />
      </Canvas>

      <DevPerfOverlay />

      {showReplay && (
        <button
          onClick={handleReplay}
          aria-label="Replay explosion"
          style={{
            position: 'absolute',
            bottom: 28,
            right: 28,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'rgba(242, 242, 247, 0.70)',
            background: 'rgba(8, 8, 10, 0.55)',
            border: '1px solid rgba(242, 242, 247, 0.18)',
            borderRadius: 8,
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'rgba(242, 242, 247, 0.95)'
            e.currentTarget.style.borderColor = 'rgba(242, 242, 247, 0.40)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(242, 242, 247, 0.70)'
            e.currentTarget.style.borderColor = 'rgba(242, 242, 247, 0.18)'
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 14 14"
            fill="none" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12.5 2.5A6 6 0 1 1 7 1" />
            <polyline points="7 1 10 1 10 4" />
          </svg>
          Replay
        </button>
      )}
    </>
  )
}
