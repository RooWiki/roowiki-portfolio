import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  Points,
  AdditiveBlending,
} from 'three'
import type { QualityTier } from '../../lib/three/performanceConfig'
import { EXPLOSION_ORIGIN } from './explosionConfig'
import {
  SPARKS_START,
  SPARKS_DURATION,
  SPARKS_COUNT,
  SPARKS_GRAVITY,
  SPARKS_SPEED_MIN,
  SPARKS_SPEED_MAX,
  SPARKS_LIFETIME_MIN,
  SPARKS_LIFETIME_MAX,
  SPARKS_UPWARD_BIAS,
  SPARKS_SIZE_MIN,
  SPARKS_SIZE_MAX,
} from './SparksConfig'

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */`
attribute vec3  aInitVel;
attribute float aLifetime;
attribute float aSize;

uniform float uTime;
uniform float uGravity;
uniform float uScale;

varying float vTNorm;
varying float vSeed;

attribute float aSeedV;

void main() {
  float age    = uTime;
  float tNorm  = clamp(age / aLifetime, 0.0, 1.0);
  vTNorm = tNorm;
  vSeed  = aSeedV;

  if (tNorm >= 1.0) {
    gl_Position  = vec4(9999.0, 9999.0, 9999.0, 1.0);
    gl_PointSize = 0.0;
    return;
  }

  // Projectile motion: pos = initPos + vel*t - 0.5*g*t² up
  vec3 pos = position
           + aInitVel * age
           + vec3(0.0, -uGravity * 0.5 * age * age, 0.0);

  vec4 mvPos    = modelViewMatrix * vec4(pos, 1.0);
  gl_Position   = projectionMatrix * mvPos;

  // Size: largest at burst, shrinks and vanishes
  float sizeScale = (1.0 - tNorm * tNorm);
  gl_PointSize = aSize * uScale * sizeScale * (300.0 / -mvPos.z);
  gl_PointSize = clamp(gl_PointSize, 0.5, 10.0);
}
`

const fragmentShader = /* glsl */`
varying float vTNorm;
varying float vSeed;

void main() {
  // Circular soft sprite
  vec2 coord = gl_PointCoord - 0.5;
  float d    = length(coord) * 2.0;
  if (d > 1.0) discard;

  // Color ramp: white-hot burst → orange arc → deep red → dark ember
  vec3 hot  = vec3(1.00, 0.96, 0.70);  // brighter white-yellow at ejection
  vec3 mid  = vec3(1.00, 0.30, 0.01);  // richer orange mid-arc
  vec3 cool = vec3(0.60, 0.05, 0.00);
  vec3 dead = vec3(0.07, 0.01, 0.00);

  vec3 col;
  if      (vTNorm < 0.25) col = mix(hot,  mid,  vTNorm / 0.25);
  else if (vTNorm < 0.65) col = mix(mid,  cool, (vTNorm - 0.25) / 0.40);
  else                    col = mix(cool, dead,  (vTNorm - 0.65) / 0.35);

  // Slightly harder edge at birth (crisp bright sparks), softer as they age
  float hardness = mix(0.30, 0.45, vTNorm);
  float edgeSoft = 1.0 - smoothstep(hardness, 0.95, d);
  float alpha    = edgeSoft * (1.0 - vTNorm * vTNorm);
  alpha = clamp(alpha, 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`

// ─── Module-level geometry / material cache (one per tier) ───────────────────

const _geoCache  = new Map<QualityTier, BufferGeometry>()
const _matCache  = new Map<QualityTier, ShaderMaterial>()

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function getSparksGeo(tier: QualityTier): BufferGeometry {
  if (_geoCache.has(tier)) return _geoCache.get(tier)!

  const n   = SPARKS_COUNT[tier]
  const rng = seededRng(42 + (tier === 'high' ? 0 : tier === 'medium' ? 1 : 2))

  const positions  = new Float32Array(n * 3)
  const initVels   = new Float32Array(n * 3)
  const lifetimes  = new Float32Array(n)
  const sizes      = new Float32Array(n)
  const seeds      = new Float32Array(n)

  for (let i = 0; i < n; i++) {
    // Start position: cluster near explosion origin with small random offset
    positions[i * 3 + 0] = EXPLOSION_ORIGIN[0] + (rng() - 0.5) * 0.6
    positions[i * 3 + 1] = EXPLOSION_ORIGIN[1] + rng() * 0.4
    positions[i * 3 + 2] = EXPLOSION_ORIGIN[2] + (rng() - 0.5) * 0.6

    // Random direction: biased upward
    const theta = rng() * Math.PI * 2
    const phi   = Math.acos(rng() * SPARKS_UPWARD_BIAS - SPARKS_UPWARD_BIAS + 1.0)
    const speed = SPARKS_SPEED_MIN + rng() * (SPARKS_SPEED_MAX - SPARKS_SPEED_MIN)
    initVels[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed
    initVels[i * 3 + 1] = Math.cos(phi) * speed
    initVels[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed

    lifetimes[i] = SPARKS_LIFETIME_MIN + rng() * (SPARKS_LIFETIME_MAX - SPARKS_LIFETIME_MIN)
    sizes[i]     = SPARKS_SIZE_MIN + rng() * (SPARKS_SIZE_MAX - SPARKS_SIZE_MIN)
    seeds[i]     = rng()
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position',  new BufferAttribute(positions, 3))
  geo.setAttribute('aInitVel',  new BufferAttribute(initVels,  3))
  geo.setAttribute('aLifetime', new BufferAttribute(lifetimes, 1))
  geo.setAttribute('aSize',     new BufferAttribute(sizes,     1))
  geo.setAttribute('aSeedV',    new BufferAttribute(seeds,     1))

  _geoCache.set(tier, geo)
  return geo
}

function getSparksMat(): ShaderMaterial {
  if (_matCache.has('high')) return _matCache.get('high')!
  const mat = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime:    { value: 0 },
      uGravity: { value: SPARKS_GRAVITY },
      uScale:   { value: 1.0 },
    },
    transparent: true,
    depthWrite:  false,
    blending:    AdditiveBlending,
  })
  _matCache.set('high', mat)
  return mat
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function Sparks({ clockRef, cycleDuration, tier }: Props) {
  const geo     = useMemo(() => getSparksGeo(tier), [tier])
  const mat     = useMemo(() => getSparksMat(),     [])
  const matRef  = useRef(mat)
  const ptsRef  = useRef<Points>(null)

  useFrame(() => {
    const t     = clockRef.current % cycleDuration
    const sysT  = t - SPARKS_START

    if (!ptsRef.current) return

    if (sysT <= 0 || sysT > SPARKS_DURATION) {
      ptsRef.current.visible = false
      return
    }
    ptsRef.current.visible = true
    matRef.current.uniforms.uTime.value = sysT
  })

  return <points ref={ptsRef} geometry={geo} material={mat} visible={false} />
}
