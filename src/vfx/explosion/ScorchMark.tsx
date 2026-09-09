import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CircleGeometry, ShaderMaterial, Mesh } from 'three'
import { EXPLOSION_ORIGIN, TIMING } from './explosionConfig'

const SCORCH_RADIUS = 3.2

const vertexShader = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform float uAlpha;
uniform float uGlow;  // 0→1 ember heat glow (early aftermath)

varying vec2 vUv;

float hash2(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

float hash3(vec2 p) {
  p = fract(p * vec2(443.9, 183.1));
  p += dot(p, p.yx + 37.31);
  return fract((p.x + p.y) * p.y);
}

void main() {
  vec2  uv   = vUv - 0.5;
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  // Irregular outer boundary — two noise scales
  float ne1 = hash2(vec2(angle * 5.0, dist * 12.0));  // fine irregularity
  float ne2 = hash3(vec2(angle * 2.0, dist * 5.5));   // coarse lobe shape
  float ne3 = hash2(vec2(angle * 0.8, dist * 2.2));   // largest lobe
  float boundary = ne1 * 0.20 + ne2 * 0.40 + ne3 * 0.40;

  // Radial falloff: center 0→0.22 = full char, 0.22→0.50 = edge heat stain
  float outerEdge = 0.42 + boundary * 0.12;
  float radial    = 1.0 - smoothstep(0.18, outerEdge, dist);
  if (radial < 0.004) discard;

  // Interior detail — fine cracked char texture
  float innerNoise = hash2(vec2(angle * 18.0, dist * 30.0)) * 0.3
                   + hash3(vec2(angle * 9.0,  dist * 16.0)) * 0.7;

  float innerMask  = 1.0 - smoothstep(0.08, 0.20, dist);
  float charDetail = innerMask * (0.60 + innerNoise * 0.40);

  // Color: deep charred center, slightly warm brownish edge
  vec3 charBlack = vec3(0.016, 0.006, 0.002);
  vec3 heatEdge  = vec3(0.042, 0.018, 0.006);
  vec3 baseColor = mix(heatEdge, charBlack, charDetail);

  // Ember glow overlay: faint orange in the inner char zone, early aftermath only
  float glowZone   = max(0.0, 1.0 - dist / 0.22);
  glowZone         = glowZone * glowZone;
  vec3  emberColor = vec3(0.60, 0.12, 0.01);
  vec3  color      = baseColor + emberColor * glowZone * uGlow * 0.55;

  gl_FragColor = vec4(color, radial * uAlpha * 0.88);
}
`

const _geo = new CircleGeometry(SCORCH_RADIUS, 64)
const _mat = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uAlpha: { value: 0 },
    uGlow:  { value: 0 },
  },
  transparent: true,
  depthWrite:  false,
})

interface Props {
  clockRef:      { current: number }
  cycleDuration: number
}

export function ScorchMark({ clockRef, cycleDuration }: Props) {
  const meshRef = useRef<Mesh>(null)
  const matRef  = useRef(_mat)

  useFrame(() => {
    if (!meshRef.current) return

    const t    = clockRef.current % cycleDuration
    const sysT = t - TIMING.scorchStart
    const dur  = TIMING.scorchEnd - TIMING.scorchStart

    if (sysT <= 0) {
      matRef.current.uniforms.uAlpha.value = 0
      meshRef.current.visible = false
      return
    }
    meshRef.current.visible = true

    // Fade in: quick, over 0.6s
    let alpha: number
    if (sysT < 0.6) {
      alpha = sysT / 0.6
    } else if (sysT < dur - 1.8) {
      alpha = 1.0
    } else {
      alpha = Math.max(0, (dur - sysT) / 1.8)
    }
    matRef.current.uniforms.uAlpha.value = alpha * 0.68

    // Ember glow: peaks during fire phase (first 2s), fades by 5s
    const glowW = Math.max(0, 1.0 - sysT / 4.5)
    matRef.current.uniforms.uGlow.value = glowW
  })

  return (
    <mesh
      ref={meshRef}
      geometry={_geo}
      material={_mat}
      position={[EXPLOSION_ORIGIN[0], EXPLOSION_ORIGIN[1] + 0.01, EXPLOSION_ORIGIN[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    />
  )
}
