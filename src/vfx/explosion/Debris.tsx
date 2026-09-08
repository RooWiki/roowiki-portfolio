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

const DEBRIS_COUNT: Record<QualityTier, number> = { high: 80, medium: 45, low: 20 }
const DEBRIS_START    = TIMING.debrisStart
const DEBRIS_DURATION = TIMING.debrisEnd - TIMING.debrisStart
const DEBRIS_GRAVITY  = 8.0   // heavier fall — debris has mass

const vertexShader = /* glsl */`
attribute vec3  aInitVel;
attribute float aLifetime;
attribute float aSize;
attribute float aSeed;

uniform float uTime;
uniform float uGravity;

varying float vTNorm;
varying float vSeed;

void main() {
  float age   = uTime;
  float tNorm = clamp(age / aLifetime, 0.0, 1.0);
  vTNorm = tNorm;
  vSeed  = aSeed;

  if (tNorm >= 1.0) {
    gl_Position  = vec4(9999.0, 9999.0, 9999.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  vec3 pos = position
           + aInitVel * age
           + vec3(0.0, -uGravity * 0.5 * age * age, 0.0);

  vec4 mvPos  = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float sizeScale = 1.0 - tNorm * 0.5;
  gl_PointSize = aSize * sizeScale * (300.0 / -mvPos.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 20.0);
}
`

const fragmentShader = /* glsl */`
varying float vTNorm;
varying float vSeed;

void main() {
  vec2  coord = gl_PointCoord - 0.5;
  float d     = length(coord) * 2.0;
  if (d > 1.0) discard;

  // Solid-edged chunks (harder edge than sparks — debris has mass)
  float edge  = 1.0 - smoothstep(0.55, 0.85, d);
  // Fade out only at end of life to stay readable against fireball
  float alpha = edge * (1.0 - vTNorm * vTNorm);

  // Rocky material: warm at ejection, cooling to dark
  vec3 hot   = vec3(0.25, 0.16, 0.08);
  vec3 rocky = vec3(0.09, 0.06, 0.03);
  vec3 color = mix(hot, rocky, vTNorm);

  gl_FragColor = vec4(color, alpha * 0.90);
}
`

const _geoCache = new Map<QualityTier, BufferGeometry>()
const _mat = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime:    { value: 0 },
    uGravity: { value: DEBRIS_GRAVITY },
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

function getDebrisGeo(tier: QualityTier): BufferGeometry {
  if (_geoCache.has(tier)) return _geoCache.get(tier)!
  const n   = DEBRIS_COUNT[tier]
  const rng = seededRng(99 + (tier === 'high' ? 0 : tier === 'medium' ? 1 : 2))

  const positions = new Float32Array(n * 3)
  const initVels  = new Float32Array(n * 3)
  const lifetimes = new Float32Array(n)
  const sizes     = new Float32Array(n)
  const seedsArr  = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    positions[i * 3 + 0] = EXPLOSION_ORIGIN[0] + (rng() - 0.5) * 0.4
    positions[i * 3 + 1] = EXPLOSION_ORIGIN[1] + rng() * 0.3
    positions[i * 3 + 2] = EXPLOSION_ORIGIN[2] + (rng() - 0.5) * 0.4

    const theta = rng() * Math.PI * 2
    const phi   = Math.acos(rng() * 1.2 - 0.2)  // upper hemisphere bias
    // Speed variation: some slow heavy chunks, some fast-ejected pieces
    const speed = 1.0 + rng() * rng() * 8.0      // skewed toward slower speeds
    initVels[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed
    initVels[i * 3 + 1] = Math.cos(phi) * speed
    initVels[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed

    lifetimes[i] = 0.8 + rng() * 1.8   // longer fall arcs
    sizes[i]     = 5.0 + rng() * 20.0  // wider size range: small chips to large chunks
    seedsArr[i]  = rng()
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position',  new BufferAttribute(positions, 3))
  geo.setAttribute('aInitVel',  new BufferAttribute(initVels,  3))
  geo.setAttribute('aLifetime', new BufferAttribute(lifetimes, 1))
  geo.setAttribute('aSize',     new BufferAttribute(sizes,     1))
  geo.setAttribute('aSeed',     new BufferAttribute(seedsArr,  1))

  _geoCache.set(tier, geo)
  return geo
}

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function Debris({ clockRef, cycleDuration, tier }: Props) {
  const geo    = useMemo(() => getDebrisGeo(tier), [tier])
  const matRef = useRef(_mat)
  const ptsRef = useRef<Points>(null)

  useFrame(() => {
    if (!ptsRef.current) return
    const t    = clockRef.current % cycleDuration
    const sysT = t - DEBRIS_START

    if (sysT <= 0 || sysT > DEBRIS_DURATION) {
      ptsRef.current.visible = false
      return
    }
    ptsRef.current.visible = true
    matRef.current.uniforms.uTime.value = sysT
  })

  return <points ref={ptsRef} geometry={geo} material={_mat} visible={false} />
}
