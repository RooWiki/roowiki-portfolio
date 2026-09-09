// Dev-only performance HUD — active only when ?vfxPerf=1 in dev mode.
// Two-part: DevPerfCanvas (inside Canvas, measures) + DevPerfOverlay (DOM, displays).

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { QualityTier } from '../lib/three/performanceConfig'

const IS_DEV = import.meta.env.DEV

function hudEnabled(): boolean {
  if (!IS_DEV) return false
  try { return new URLSearchParams(window.location.search).has('vfxPerf') } catch { return false }
}

// Evaluated once at module load; never changes at runtime.
const HUD_ON = hudEnabled()

// Shared reference to the overlay DOM element.
let _el: HTMLElement | null = null

// ─── Canvas-side ──────────────────────────────────────────────────────────────

interface CanvasProps {
  tier:   QualityTier
  onFps?: (fps: number) => void
}

export function DevPerfCanvas({ tier, onFps }: CanvasProps) {
  const { gl } = useThree()
  const buf    = useRef<number[]>([])
  const tick   = useRef(0)

  useFrame((_s, delta) => {
    const ms = delta * 1000
    buf.current.push(ms)
    if (buf.current.length > 60) buf.current.shift()

    tick.current++

    // Call onFps roughly once per second for adaptive quality checks.
    if (onFps && tick.current % 60 === 0 && buf.current.length > 0) {
      const avg = buf.current.reduce((a, b) => a + b, 0) / buf.current.length
      onFps(1000 / avg)
    }

    if (!HUD_ON || !_el || buf.current.length === 0) return

    const avg   = buf.current.reduce((a, b) => a + b, 0) / buf.current.length
    const fps   = 1000 / avg
    const info  = gl.info.render
    const dpr   = gl.getPixelRatio()

    _el.innerHTML =
      `<span style="color:#00ff88;font-weight:bold">${fps.toFixed(0)} FPS</span>` +
      ` &middot; ${avg.toFixed(1)} ms<br>` +
      `Calls: ${info.calls} &middot; Tri: ${(info.triangles / 1000).toFixed(1)}k<br>` +
      `Tier: <b>${tier}</b> &middot; DPR: ${dpr.toFixed(2)}`
  })

  return null
}

// ─── DOM overlay ──────────────────────────────────────────────────────────────

export function DevPerfOverlay() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!HUD_ON) return
    _el = ref.current
    return () => { _el = null }
  }, [])

  if (!HUD_ON) return null

  return (
    <div
      ref={ref}
      style={{
        position:     'absolute',
        top:          12,
        left:         12,
        zIndex:       99,
        padding:      '8px 12px',
        fontFamily:   'monospace',
        fontSize:     11,
        lineHeight:   1.65,
        color:        '#a0f0c0',
        background:   'rgba(0, 0, 0, 0.75)',
        border:       '1px solid rgba(0, 255, 136, 0.22)',
        borderRadius: 4,
        pointerEvents:'none',
        whiteSpace:   'nowrap',
      }}
    />
  )
}
