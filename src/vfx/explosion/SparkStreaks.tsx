// Fast ejection streaks — second spark population.
// Each streak is a line segment: tail (aIsHead=0) → head (aIsHead=1).
// The vertex shader computes both endpoint positions from the same initial
// velocity attribute using projectile physics.  The interpolated vIsHead
// varying produces a natural gradient from dim red tail to bright white head.
// Uses LineSegments (not Points) so streaks are elongated, direction-aligned.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  LineSegments,
  AdditiveBlending,
} from 'three'
import type { QualityTier } from '../../lib/three/performanceConfig'
import { EXPLOSION_ORIGIN } from './explosionConfig'
import { SPARKS_START } from './SparksConfig'

// ─── Timing / physics ────────────────────────────────────────────────────────
const STREAK_DURATION    = 0.65   // seconds the streak system is active
const STREAK_TRAIL       = 0.12   // tail trails this many seconds behind the head
const STREAK_GRAVITY     = 5.5
const STREAK_SPEED_MIN   = 4.5
const STREAK_SPEED_MAX   = 14.0
const STREAK_LIFETIME_MIN = 0.12
const STREAK_LIFETIME_MAX = 0.55

const STREAK_COUNT: Record<QualityTier, number> = {
  high:   420,
  medium: 210,
  low:    80,
}

// ─── Shaders ─────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */`
attribute vec3  aInitVel;
attribute float aLifetime;
attribute float aIsHead;   // 0 = tail endpoint, 1 = head endpoint

uniform float uTime;
uniform float uGravity;
uniform float uTrail;

varying float vTNorm;
varying float vIsHead;

void main() {
  float age   = uTime;
  float tNorm = clamp(age / aLifetime, 0.0, 1.0);
  vTNorm  = tNorm;
  vIsHead = aIsHead;

  if (tNorm >= 1.0) {
    // Move degenerate segment off-screen
    gl_Position = vec4(9999.0, 9999.0, 9999.0, 1.0);
    return;
  }

  // Head at current age, tail at (age - trailLength)
  float sampleAge = age - uTrail * (1.0 - aIsHead);
  sampleAge = max(sampleAge, 0.0);

  vec3 pos = position
           + aInitVel * sampleAge
           + vec3(0.0, -uGravity * 0.5 * sampleAge * sampleAge, 0.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const fragmentShader = /* glsl */`
varying float vTNorm;
varying float vIsHead;

void main() {
  // Gradient: tail = transparent dark red, head = bright white-yellow
  float alpha = mix(0.0, 1.0, vIsHead) * (1.0 - vTNorm * vTNorm);
  alpha = clamp(alpha, 0.0, 1.0);
  if (alpha < 0.01) discard;

  vec3 tail = vec3(0.55, 0.08, 0.00);
  vec3 head = vec3(1.00, 0.92, 0.60);
  vec3 col  = mix(tail, head, vIsHead * vIsHead);

  gl_FragColor = vec4(col, alpha);
}
`

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function seededRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// ─── Geometry cache ───────────────────────────────────────────────────────────
const _geoCache = new Map<QualityTier, BufferGeometry>()

function getStreakGeo(tier: QualityTier): BufferGeometry {
  if (_geoCache.has(tier)) return _geoCache.get(tier)!

  const n   = STREAK_COUNT[tier]
  const rng = seededRng(7 + (tier === 'high' ? 0 : tier === 'medium' ? 1 : 2))

  // 2 vertices per streak (tail + head)
  const positions = new Float32Array(n * 2 * 3)
  const initVels  = new Float32Array(n * 2 * 3)
  const lifetimes = new Float32Array(n * 2)
  const isHeads   = new Float32Array(n * 2)

  for (let i = 0; i < n; i++) {
    const lifetime = STREAK_LIFETIME_MIN + rng() * (STREAK_LIFETIME_MAX - STREAK_LIFETIME_MIN)
    const speed    = STREAK_SPEED_MIN    + rng() * (STREAK_SPEED_MAX - STREAK_SPEED_MIN)

    // Random direction: wide hemisphere, slightly upward biased
    const theta = rng() * Math.PI * 2
    const phi   = Math.acos(rng() * 0.8)  // 0.8 bias → mostly upward hemisphere
    const vx    = Math.sin(phi) * Math.cos(theta) * speed
    const vy    = Math.cos(phi) * speed
    const vz    = Math.sin(phi) * Math.sin(theta) * speed

    // Spawn near explosion origin
    const ox = EXPLOSION_ORIGIN[0] + (rng() - 0.5) * 0.4
    const oy = EXPLOSION_ORIGIN[1] + rng() * 0.3
    const oz = EXPLOSION_ORIGIN[2] + (rng() - 0.5) * 0.4

    for (let end = 0; end < 2; end++) {
      const vi = (i * 2 + end) * 3
      const si = i * 2 + end
      positions[vi]     = ox
      positions[vi + 1] = oy
      positions[vi + 2] = oz
      initVels[vi]     = vx
      initVels[vi + 1] = vy
      initVels[vi + 2] = vz
      lifetimes[si]    = lifetime
      isHeads[si]      = end   // 0 = tail, 1 = head
    }
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position',  new BufferAttribute(positions, 3))
  geo.setAttribute('aInitVel',  new BufferAttribute(initVels,  3))
  geo.setAttribute('aLifetime', new BufferAttribute(lifetimes, 1))
  geo.setAttribute('aIsHead',   new BufferAttribute(isHeads,   1))

  _geoCache.set(tier, geo)
  return geo
}

// ─── Material cache ────────────────────────────────────────────────────────────
const _matCache = new Map<QualityTier, ShaderMaterial>()

function getStreakMat(tier: QualityTier): ShaderMaterial {
  if (_matCache.has(tier)) return _matCache.get(tier)!
  const mat = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime:    { value: 0 },
      uGravity: { value: STREAK_GRAVITY },
      uTrail:   { value: STREAK_TRAIL },
    },
    transparent: true,
    depthWrite:  false,
    blending:    AdditiveBlending,
  })
  _matCache.set(tier, mat)
  return mat
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function SparkStreaks({ clockRef, cycleDuration, tier }: Props) {
  const geo    = useMemo(() => getStreakGeo(tier), [tier])
  const mat    = useMemo(() => getStreakMat(tier), [tier])
  const matRef = useRef(mat)
  const lsRef  = useRef<LineSegments>(null)

  useFrame(() => {
    const t    = clockRef.current % cycleDuration
    const sysT = t - SPARKS_START

    if (!lsRef.current) return

    if (sysT <= 0 || sysT > STREAK_DURATION) {
      lsRef.current.visible = false
      return
    }
    lsRef.current.visible = true
    matRef.current.uniforms.uTime.value = sysT
  })

  return <lineSegments ref={lsRef} geometry={geo} material={mat} visible={false} />
}
