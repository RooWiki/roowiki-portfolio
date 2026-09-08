import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { SphereGeometry } from 'three'
import type { Mesh, ShaderMaterial } from 'three'
import type { QualityTier } from '../../../lib/three/performanceConfig'
import {
  FIREBALL_ORIGIN,
  FIREBALL_START,
  FIREBALL_DURATION,
  FIREBALL_MAX_RADIUS,
  FIREBALL_UPWARD_DRIFT,
  LOBE_DESCRIPTORS,
  lobeScaleCurve,
} from './fireballConfig'
import { createFireballMaterial } from './FireballMaterial'

// ─── Module-level Three.js object cache ───────────────────────────────────────
// Geometry and materials live for the page session — one Fireball instance
// ever exists, and the tier never changes after initial detection.
// Using module scope avoids both useMemo mutation warnings and the
// react/refs rule that fires when reading ref.current during render.

const _geo  = new Map<number, SphereGeometry>()
const _mats = new Map<QualityTier, ShaderMaterial[]>()

function getGeo(tier: QualityTier): SphereGeometry {
  const seg = tier === 'low' ? 16 : tier === 'medium' ? 22 : 30
  if (!_geo.has(seg)) {
    _geo.set(seg, new SphereGeometry(1, seg, Math.round(seg * 0.75)))
  }
  return _geo.get(seg)!
}

function getMats(tier: QualityTier): ShaderMaterial[] {
  if (!_mats.has(tier)) {
    _mats.set(tier, LOBE_DESCRIPTORS.map(ld => createFireballMaterial(
      ld.seed,
      tier,
      ld.erosionThreshold,
      ld.depth,
      ld.isCore ? 0.12 : 0.78,
      ld.isCore,
    )))
  }
  return _mats.get(tier)!
}

// ─── Fixed lobe count — must match LOBE_DESCRIPTORS.length ────────────────────
const LOBE_COUNT = 8

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
  tier:          QualityTier
}

export function Fireball({ clockRef, cycleDuration, tier }: Props) {
  const geo = getGeo(tier)

  // matsRef lets useFrame mutate uniforms without triggering the lint rule that
  // flags mutations of local variables declared in the component body.
  const matsRef = useRef(getMats(tier))

  const meshRefs = useRef<Array<Mesh | null>>(Array(LOBE_COUNT).fill(null))

  useFrame(() => {
    const t = clockRef.current % cycleDuration

    for (let i = 0; i < LOBE_COUNT; i++) {
      const mesh = meshRefs.current[i]
      const mat  = matsRef.current[i]
      const ld   = LOBE_DESCRIPTORS[i]
      if (!mesh || !mat) continue

      const lobeT = t - FIREBALL_START - ld.delay

      if (lobeT <= 0 || lobeT >= FIREBALL_DURATION) {
        mesh.visible = false
        continue
      }

      mesh.visible = true
      const lobeLife = lobeT / FIREBALL_DURATION

      mesh.scale.setScalar(
        FIREBALL_MAX_RADIUS * ld.baseScale * lobeScaleCurve(lobeLife * ld.expansionRate),
      )

      // Upward buoyancy: quadratic ease over lobe lifetime
      mesh.position.set(
        FIREBALL_ORIGIN[0] + ld.offset[0],
        FIREBALL_ORIGIN[1] + ld.offset[1] + FIREBALL_UPWARD_DRIFT * lobeLife * lobeLife,
        FIREBALL_ORIGIN[2] + ld.offset[2],
      )

      // Uniform writes — plain number assignments, no allocation
      mat.uniforms.uTime.value = t
      mat.uniforms.uLife.value = lobeLife
    }
  })

  return (
    <>
      {LOBE_DESCRIPTORS.map((ld, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          geometry={geo}
          material={getMats(tier)[i]}
          visible={false}
          position={[
            FIREBALL_ORIGIN[0] + ld.offset[0],
            FIREBALL_ORIGIN[1] + ld.offset[1],
            FIREBALL_ORIGIN[2] + ld.offset[2],
          ]}
        />
      ))}
    </>
  )
}
