import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CircleGeometry, ShaderMaterial, Mesh } from 'three'
import { EXPLOSION_ORIGIN, TIMING } from './explosionConfig'

const SCORCH_RADIUS = 3.0

const vertexShader = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = /* glsl */`
uniform float uAlpha;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

void main() {
  vec2 uv = vUv - 0.5;         // center at 0,0
  float dist = length(uv);     // 0 = center, 0.5 = edge

  // Radial fade with organic edge
  float radial = 1.0 - smoothstep(0.22, 0.50, dist);

  // Multi-scale edge noise for irregular scorch boundary
  float angle  = atan(uv.y, uv.x);
  float noise1 = hash(vec2(angle * 4.0,  dist * 10.0));  // fine edge
  float noise2 = hash(vec2(angle * 1.5,  dist * 4.0));   // coarse shape
  float noise  = noise1 * 0.40 + noise2 * 0.60;

  // Inner char (darker) vs outer heat stain (slightly lighter)
  float innerMask = 1.0 - smoothstep(0.10, 0.20, dist);
  float irregular  = radial * (0.55 + noise * 0.45);

  // Dark burnt center, slightly less dark at edges (heat stain effect)
  vec3 center = vec3(0.020, 0.008, 0.003);
  vec3 edge   = vec3(0.040, 0.018, 0.006);
  vec3 color  = mix(edge, center, innerMask);

  gl_FragColor = vec4(color, irregular * uAlpha * 0.90);
}
`

const _geo = new CircleGeometry(SCORCH_RADIUS, 48)
const _mat = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: { uAlpha: { value: 0 } },
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

    // Fade in quickly, persist for cycle remainder, fade out near cycle end
    let alpha: number
    if (sysT < 0.6) {
      alpha = sysT / 0.6                 // quick fade-in
    } else if (sysT < dur - 1.5) {
      alpha = 1.0                         // full opacity
    } else {
      alpha = (dur - sysT) / 1.5         // fade out at end
    }
    matRef.current.uniforms.uAlpha.value = Math.max(0, alpha) * 0.65
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
