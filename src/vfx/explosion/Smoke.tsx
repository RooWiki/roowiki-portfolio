import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  PlaneGeometry,
  ShaderMaterial,
  InstancedMesh,
  Object3D,
  NormalBlending,
} from 'three'
import type { QualityTier } from '../../lib/three/performanceConfig'
import { SMOKE_START, SMOKE_DURATION, getSmokePuffs } from './SmokeConfig'

// ─── Smoke billboard shader ───────────────────────────────────────────────────

const vertexShader = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform float uAlpha;
uniform float uSeed;
uniform float uAge;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract((p.x + p.y) * p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = vUv - 0.5;

  float dist = length(uv);
  float mask = 1.0 - smoothstep(0.25, 0.50, dist);
  if (mask < 0.01) discard;

  vec2 noiseUv = uv * 2.5 + vec2(uSeed * 3.7, uSeed * 1.2);
  float n1 = noise(noiseUv);
  float n2 = noise(noiseUv * 2.1 + vec2(uAge * 0.4, uAge * -0.3));
  float turbulence = n1 * 0.6 + n2 * 0.4;

  float alpha = mask * turbulence * uAlpha * (1.0 - uAge * 0.8);
  alpha = clamp(alpha, 0.0, 1.0);
  if (alpha < 0.005) discard;

  // Hot smoke (early) → dark smoke (late)
  vec3 hotSmoke  = vec3(0.22, 0.14, 0.08);
  vec3 darkSmoke = vec3(0.06, 0.05, 0.04);
  vec3 color     = mix(hotSmoke, darkSmoke, uAge);

  gl_FragColor = vec4(color, alpha);
}
`

// ─── Module-level cache (same pattern as Fireball) ────────────────────────────
// Materials live for the session — one Smoke instance per tier ever mounts.

const _geo      = new PlaneGeometry(1, 1)
const _matCache = new Map<QualityTier, ShaderMaterial[]>()

function makePuffMaterial(seed: number): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uAlpha: { value: 0 },
      uSeed:  { value: seed },
      uAge:   { value: 0 },
    },
    transparent: true,
    depthWrite:  false,
    blending:    NormalBlending,
    side:        2, // DoubleSide
  })
}

function getSmokeMats(tier: QualityTier): ShaderMaterial[] {
  if (_matCache.has(tier)) return _matCache.get(tier)!
  const puffs = getSmokePuffs(tier)
  const mats  = puffs.map(p => makePuffMaterial(p.seed))
  _matCache.set(tier, mats)
  return mats
}

// Pre-allocated dummy object — reused every frame, no allocation
const _dummy = new Object3D()

const MAX_PUFFS = 32

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function Smoke({ clockRef, cycleDuration, tier }: Props) {
  const puffs   = getSmokePuffs(tier)
  const matsRef = useRef(getSmokeMats(tier))

  const meshRefs = useRef<Array<InstancedMesh | null>>(Array(MAX_PUFFS).fill(null))

  useFrame(({ camera }) => {
    const t    = clockRef.current % cycleDuration
    const sysT = t - SMOKE_START

    for (let i = 0; i < puffs.length; i++) {
      const mesh = meshRefs.current[i]
      const mat  = matsRef.current[i]
      const p    = puffs[i]
      if (!mesh || !mat) continue

      const puffAge = sysT - p.birthOffset

      if (puffAge <= 0 || puffAge > p.lifetime || sysT <= 0 || sysT > SMOKE_DURATION) {
        mesh.visible = false
        continue
      }
      mesh.visible = true

      const tNorm      = puffAge / p.lifetime
      const worldScale = p.baseScale + (p.maxScale - p.baseScale) * tNorm
      const wx = p.initPos[0] + p.driftX * puffAge
      const wy = p.initPos[1] + p.riseSpeed * puffAge
      const wz = p.initPos[2] + p.driftZ * puffAge

      _dummy.position.set(wx, wy, wz)
      _dummy.scale.setScalar(worldScale)
      _dummy.lookAt(camera.position)
      _dummy.rotateZ(p.rotSpeed * puffAge)
      _dummy.updateMatrix()
      mesh.setMatrixAt(0, _dummy.matrix)
      mesh.instanceMatrix.needsUpdate = true

      mat.uniforms.uAge.value   = tNorm
      mat.uniforms.uAlpha.value = 0.55
    }
  })

  return (
    <>
      {puffs.map((_, i) => (
        <instancedMesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          args={[_geo, getSmokeMats(tier)[i], 1]}
          visible={false}
        />
      ))}
    </>
  )
}
