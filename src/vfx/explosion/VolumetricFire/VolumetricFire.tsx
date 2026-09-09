import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BoxGeometry,
  ShaderMaterial,
  Mesh,
  BackSide,
  Vector3,
  NormalBlending,
} from 'three'
import type { QualityTier } from '../../../lib/three/performanceConfig'
import {
  VOL_START,
  VOL_FIRE_END,
  VOL_SMOKE_END,
  VOL_ORIGIN,
  VOL_RADIUS_MAX,
  VOL_HEIGHT_MAX,
  VOL_RISE_SPEED,
  MARCH_STEPS,
  NOISE_OCTAVES,
} from './volumetricConfig'
import {
  volumetricVertexShader,
  volumetricFragmentShader,
} from './VolumetricFireShader'
import {
  COLOR_HOT,
  COLOR_BRIGHT,
  COLOR_MID,
  COLOR_COOL,
  COLOR_DEAD,
} from '../Fireball/fireballConfig'

// ─── Static geometry (shared across tiers) ───────────────────────────────────
// Unit cube, back-face rendered so the fragment exists regardless of camera depth
const _geo = new BoxGeometry(1, 1, 1)

// ─── Per-tier material cache ──────────────────────────────────────────────────
const _matCache = new Map<QualityTier, ShaderMaterial>()

function getVolMat(tier: QualityTier): ShaderMaterial {
  if (_matCache.has(tier)) return _matCache.get(tier)!

  const mat = new ShaderMaterial({
    vertexShader:   volumetricVertexShader,
    fragmentShader: volumetricFragmentShader,
    uniforms: {
      uBoxMin:           { value: new Vector3(-1, -1, -1) },
      uBoxMax:           { value: new Vector3( 1,  1,  1) },
      uExplosionOrigin:  { value: new Vector3(...VOL_ORIGIN) },
      uSysT:             { value: 0.0 },
      uFireNorm:         { value: 0.0 },
      uSmokeNorm:        { value: 0.0 },
      uExpRadius:        { value: 0.5 },
      uColorHot:         { value: new Vector3(...COLOR_HOT) },
      uColorBright:      { value: new Vector3(...COLOR_BRIGHT) },
      uColorMid:         { value: new Vector3(...COLOR_MID) },
      uColorCool:        { value: new Vector3(...COLOR_COOL) },
      uColorDead:        { value: new Vector3(...COLOR_DEAD) },
      uSmokeColor:       { value: new Vector3(0.06, 0.05, 0.04) },
    },
    defines: {
      MAX_STEPS: MARCH_STEPS[tier],
      OCTAVES:   NOISE_OCTAVES[tier],
    },
    transparent: true,
    depthWrite:  false,
    depthTest:   false,
    blending:    NormalBlending,
    side:        BackSide,
  })

  _matCache.set(tier, mat)
  return mat
}

// ─── Pre-allocated scratch vectors ───────────────────────────────────────────
const _boxMin    = new Vector3()
const _boxMax    = new Vector3()
const _boxCenter = new Vector3()
const _boxScale  = new Vector3()

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function VolumetricFire({ clockRef, cycleDuration, tier }: Props) {
  const mat     = useMemo(() => getVolMat(tier), [tier])
  const matRef  = useRef(mat)
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    const t    = clockRef.current % cycleDuration
    const sysT = t - VOL_START

    if (!meshRef.current) return

    if (sysT <= 0 || sysT > VOL_SMOKE_END) {
      meshRef.current.visible = false
      return
    }
    meshRef.current.visible = true

    // ── Expanding radius ─────────────────────────────────────────────────────
    // Fast early expansion, asymptotes to max radius
    const expand    = 1.0 - Math.exp(-sysT * 2.2)
    const expRadius = 0.4 + expand * VOL_RADIUS_MAX
    const rxz       = expRadius + 0.6   // bounding box XZ half-extent (wider than fire)

    // ── Rising column height ─────────────────────────────────────────────────
    const rise     = Math.min(sysT * VOL_RISE_SPEED, VOL_HEIGHT_MAX * 0.85)
    const topY     = Math.min(VOL_ORIGIN[1] + 1.2 + rise * 1.4, VOL_ORIGIN[1] + VOL_HEIGHT_MAX)

    // ── Box bounds ────────────────────────────────────────────────────────────
    _boxMin.set(
      VOL_ORIGIN[0] - rxz,
      VOL_ORIGIN[1] - 0.5,
      VOL_ORIGIN[2] - rxz,
    )
    _boxMax.set(
      VOL_ORIGIN[0] + rxz,
      topY,
      VOL_ORIGIN[2] + rxz,
    )

    // Sync mesh transform so the geometry matches the box bounds
    _boxCenter.addVectors(_boxMin, _boxMax).multiplyScalar(0.5)
    _boxScale.subVectors(_boxMax, _boxMin)
    meshRef.current.position.copy(_boxCenter)
    meshRef.current.scale.copy(_boxScale)

    // ── Uniforms ─────────────────────────────────────────────────────────────
    const fireDur  = VOL_FIRE_END - VOL_START
    const smokeDur = VOL_SMOKE_END - VOL_START

    const u = matRef.current.uniforms
    u.uBoxMin.value.copy(_boxMin)
    u.uBoxMax.value.copy(_boxMax)
    u.uSysT.value       = sysT
    u.uFireNorm.value   = Math.min(sysT / fireDur, 1.0)
    u.uSmokeNorm.value  = Math.max(0.0, Math.min((sysT - 0.4) / (smokeDur * 0.5), 1.0))
    u.uExpRadius.value  = expRadius
  })

  return (
    <mesh
      ref={meshRef}
      geometry={_geo}
      material={mat}
      visible={false}
      frustumCulled={false}
    />
  )
}
