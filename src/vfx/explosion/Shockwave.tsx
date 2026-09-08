import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RingGeometry, ShaderMaterial, Mesh, AdditiveBlending } from 'three'
import { EXPLOSION_ORIGIN, TIMING } from './explosionConfig'
import { envelope } from './ExplosionTimeline'

const SHOCKWAVE_MAX_RADIUS = 5.5  // world units at full expansion
const SHOCKWAVE_RING_WIDTH = 0.55 // fraction of total radius used for ring width

const vertexShader = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform float uProgress;  // 0→1 expansion
uniform float uAlpha;

varying vec2 vUv;

void main() {
  // vUv.y = 0 at inner edge, 1 at outer edge of ring
  float ring  = 1.0 - abs(vUv.y - 0.5) * 2.0;   // 0 at edges, 1 at ring center
  float alpha = ring * ring * uAlpha;

  // Dusty warm tone — subtle, not a bright white ring
  vec3 color = vec3(0.75, 0.45, 0.20);
  gl_FragColor = vec4(color, alpha);
}
`

const _geo = new RingGeometry(
  1.0 - SHOCKWAVE_RING_WIDTH,   // innerRadius (fraction)
  1.0,                           // outerRadius
  64,
  4,
)

const _mat = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uProgress: { value: 0 },
    uAlpha:    { value: 0 },
  },
  transparent: true,
  depthWrite:  false,
  blending:    AdditiveBlending,
  side:        2, // DoubleSide
})

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
}

export function Shockwave({ clockRef, cycleDuration }: Props) {
  const meshRef = useRef<Mesh>(null)
  const matRef  = useRef(_mat)

  useFrame(() => {
    if (!meshRef.current) return
    const t    = clockRef.current % cycleDuration
    const sysT = t - TIMING.shockwaveStart
    const dur  = TIMING.shockwaveEnd - TIMING.shockwaveStart

    if (sysT <= 0 || sysT >= dur) {
      meshRef.current.visible = false
      return
    }
    meshRef.current.visible = true

    const progress = sysT / dur

    // Scale ring outward
    const radius = SHOCKWAVE_MAX_RADIUS * progress
    meshRef.current.scale.setScalar(radius)

    // Alpha: strong at start, fades away
    matRef.current.uniforms.uProgress.value = progress
    matRef.current.uniforms.uAlpha.value    =
      envelope(sysT, dur * 0.08, dur) * 0.70
  })

  return (
    <mesh
      ref={meshRef}
      geometry={_geo}
      material={_mat}
      position={EXPLOSION_ORIGIN}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    />
  )
}
