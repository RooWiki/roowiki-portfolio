import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Points,
  NormalBlending,
} from 'three'
import type { QualityTier } from '../../lib/three/performanceConfig'
import { EXPLOSION_ORIGIN, TIMING } from './explosionConfig'

const DUST_COUNT: Record<QualityTier, number> = { high: 800, medium: 400, low: 160 }
const DUST_START    = TIMING.dustStart
const DUST_DURATION = TIMING.dustEnd - TIMING.dustStart
const DUST_GRAVITY  = 1.2
const DUST_DRAG     = 1.8   // velocity damping factor

const vertexShader = /* glsl */`
attribute vec3  aInitVel;
attribute float aLifetime;
attribute float aSize;

uniform float uTime;
uniform float uGravity;
uniform float uDrag;

varying float vTNorm;

void main() {
  float age   = uTime;
  float tNorm = clamp(age / aLifetime, 0.0, 1.0);
  vTNorm = tNorm;

  if (tNorm >= 1.0) {
    gl_Position  = vec4(9999.0, 9999.0, 9999.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  // Exponential drag: pos = v0/drag * (1 - exp(-drag*t)) - gravity
  float expDrag = exp(-uDrag * age);
  vec3 driftXZ = aInitVel * (1.0 - expDrag) / uDrag;
  float driftY = aInitVel.y * (1.0 - expDrag) / uDrag
               - uGravity * 0.5 * age * age;
  vec3 pos = position + vec3(driftXZ.x, driftY, driftXZ.z);

  vec4 mvPos    = modelViewMatrix * vec4(pos, 1.0);
  gl_Position   = projectionMatrix * mvPos;

  // Dust puffs grow and then fade: scale up with age
  float sizeScale = min(tNorm * 3.0, 1.0) * (1.0 - tNorm * 0.6);
  gl_PointSize = aSize * sizeScale * (300.0 / -mvPos.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 40.0);
}
`

const fragmentShader = /* glsl */`
varying float vTNorm;

void main() {
  vec2  coord = gl_PointCoord - 0.5;
  float d     = length(coord) * 2.0;
  if (d > 1.0) discard;

  float edge  = 1.0 - smoothstep(0.3, 1.0, d);
  float alpha = edge * (1.0 - vTNorm) * 0.50;
  alpha = clamp(alpha, 0.0, 1.0);

  // Warm sandy dust color
  vec3 color = mix(vec3(0.30, 0.18, 0.08), vec3(0.15, 0.09, 0.04), vTNorm);

  gl_FragColor = vec4(color, alpha);
}
`

const _geoCache = new Map<QualityTier, BufferGeometry>()
const _mat = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime:    { value: 0 },
    uGravity: { value: DUST_GRAVITY },
    uDrag:    { value: DUST_DRAG },
  },
  transparent: true,
  depthWrite:  false,
  blending:    NormalBlending,
})

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function getDustGeo(tier: QualityTier): BufferGeometry {
  if (_geoCache.has(tier)) return _geoCache.get(tier)!
  const n   = DUST_COUNT[tier]
  const rng = seededRng(77 + (tier === 'high' ? 0 : tier === 'medium' ? 1 : 2))

  const positions = new Float32Array(n * 3)
  const initVels  = new Float32Array(n * 3)
  const lifetimes = new Float32Array(n)
  const sizes     = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    // Start near ground level around explosion origin
    const angle = rng() * Math.PI * 2
    const dist  = rng() * 0.5
    positions[i * 3 + 0] = EXPLOSION_ORIGIN[0] + Math.cos(angle) * dist
    positions[i * 3 + 1] = EXPLOSION_ORIGIN[1] + rng() * 0.1
    positions[i * 3 + 2] = EXPLOSION_ORIGIN[2] + Math.sin(angle) * dist

    // Mostly radial horizontal velocity, very little upward
    const speed = 1.5 + rng() * 3.5
    initVels[i * 3 + 0] = Math.cos(angle) * speed
    initVels[i * 3 + 1] = rng() * 0.6
    initVels[i * 3 + 2] = Math.sin(angle) * speed

    lifetimes[i] = 0.5 + rng() * 0.8
    sizes[i]     = 20 + rng() * 30
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position',  new BufferAttribute(positions, 3))
  geo.setAttribute('aInitVel',  new BufferAttribute(initVels,  3))
  geo.setAttribute('aLifetime', new BufferAttribute(lifetimes, 1))
  geo.setAttribute('aSize',     new BufferAttribute(sizes,     1))

  _geoCache.set(tier, geo)
  return geo
}

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function GroundDust({ clockRef, cycleDuration, tier }: Props) {
  const geo    = useMemo(() => getDustGeo(tier), [tier])
  const matRef = useRef(_mat)
  const ptsRef = useRef<Points>(null)

  useFrame(() => {
    if (!ptsRef.current) return
    const t    = clockRef.current % cycleDuration
    const sysT = t - DUST_START

    if (sysT <= 0 || sysT > DUST_DURATION) {
      ptsRef.current.visible = false
      return
    }
    ptsRef.current.visible = true
    matRef.current.uniforms.uTime.value = sysT
  })

  return <points ref={ptsRef} geometry={geo} material={_mat} visible={false} />
}
