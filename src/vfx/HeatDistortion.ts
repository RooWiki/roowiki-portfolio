import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'

// Screen-space heat ripple effect.
// mainUv() distorts sample coordinates in a radial wave pattern around
// the explosion's projected screen position, fading with distance.
// Active only during the fireball phase — strength is updated each frame
// from PostFx via the uniforms map.

const fragmentShader = /* glsl */`
uniform float uTime;
uniform vec2  uCenter;
uniform float uStrength;

void mainUv(inout vec2 uv) {
  vec2  dir  = uv - uCenter;
  float dist = length(dir);

  // Limit distortion to a radius of ~0.28 UV units around the explosion
  float mask = smoothstep(0.28, 0.04, dist);
  if (mask < 0.001) return;

  // Outward ripple wave
  float wave = sin(dist * 32.0 - uTime * 7.0) * uStrength * mask;

  // Normalise direction; guard against zero-length vector at dead center
  if (dist > 0.001) {
    uv += (dir / dist) * wave;
  }
}
`

export class HeatDistortionEffect extends Effect {
  constructor() {
    super('HeatDistortionEffect', fragmentShader, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['uTime',     new Uniform(0)],
        ['uCenter',   new Uniform(new Vector2(0.5, 0.5))],
        ['uStrength', new Uniform(0)],
      ]),
    })
  }
}
