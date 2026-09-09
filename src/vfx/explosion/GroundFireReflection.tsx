// Procedural fire reflection on the ground plane — no SSR, no textures.
// An AdditiveBlending overlay that adds warm orange light under the fire,
// driven by the volumetric fire's energy envelope.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  AdditiveBlending,
  Vector2,
} from 'three'
import { EXPLOSION_ORIGIN } from './explosionConfig'
import { VOL_START, VOL_FIRE_END } from './VolumetricFire/volumetricConfig'

const _geo = new PlaneGeometry(14, 14)

// sysT (= t - VOL_START) at which the reflection fully fades out.
const REFL_SYST_END = (VOL_FIRE_END - VOL_START) + 1.5   // ~3.64s in sysT

const vertexShader = /* glsl */`
varying vec2 vXZ;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vXZ     = wp.xz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform float uEnergy;
uniform vec2  uOriginXZ;
uniform float uTime;

varying vec2 vXZ;

float hash2(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 17.3);
  return fract((p.x + p.y) * p.x);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash2(i),                  hash2(i + vec2(1.0, 0.0)), u.x),
    mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2  off  = vXZ - uOriginXZ;
  float dist = length(off);

  // Animated noise warps the effective radius for a flickering silhouette.
  float angle = atan(off.y, off.x);
  float warp  = noise2(vec2(angle * 2.2 + uTime * 1.1, uTime * 0.7)) * 1.0;
  float effR  = 3.8 + warp;

  // Cubic falloff: tight, bright core that melts away at the edge.
  float radFade = clamp(1.0 - dist / effR, 0.0, 1.0);
  radFade = radFade * radFade * radFade;

  float glow = radFade * uEnergy;
  if (glow < 0.004) discard;

  vec3 coreCol = vec3(1.00, 0.85, 0.45);
  vec3 rimCol  = vec3(0.60, 0.06, 0.00);
  vec3 color   = mix(rimCol, coreCol, radFade);

  // AdditiveBlending: alpha modulates how much color is added to the scene.
  gl_FragColor = vec4(color, glow * 0.48);
}
`

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
}

export function GroundFireReflection({ clockRef, cycleDuration }: Props) {
  const mat = useMemo(() => new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uEnergy:   { value: 0.0 },
      uOriginXZ: { value: new Vector2(EXPLOSION_ORIGIN[0], EXPLOSION_ORIGIN[2]) },
      uTime:     { value: 0.0 },
    },
    transparent: true,
    depthWrite:  false,
    depthTest:   true,
    blending:    AdditiveBlending,
  }), [])

  const matRef  = useRef(mat)
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    const t    = clockRef.current % cycleDuration
    const sysT = t - VOL_START

    if (!meshRef.current) return

    if (sysT <= 0 || sysT >= REFL_SYST_END) {
      meshRef.current.visible = false
      return
    }
    meshRef.current.visible = true

    // Sharp rise (0→0.25s), smooth decay to REFL_SYST_END.
    const rise   = Math.min(sysT / 0.25, 1.0)
    const decay  = Math.max(0.0, 1.0 - sysT / REFL_SYST_END)
    const energy = rise * decay

    matRef.current.uniforms.uEnergy.value = energy
    matRef.current.uniforms.uTime.value   = t
  })

  return (
    <mesh
      ref={meshRef}
      geometry={_geo}
      material={mat}
      position={[EXPLOSION_ORIGIN[0], 0.002, EXPLOSION_ORIGIN[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
      renderOrder={1}
    />
  )
}
