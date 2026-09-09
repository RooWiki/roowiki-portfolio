import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'

// Combined screen-space distortion effect.
//
// mainUv() applies two independent warps:
//
//  1. Heat haze — radial ripple around the projected explosion centre,
//     active during the fireball phase.  Strength is ramped from PostFx.
//
//  2. Shockwave ring — a sharp outward distortion at an expanding ring
//     radius.  Simulates the pressure wave refracting the scene like glass.
//     The ring radius expands from 0 to uShockwaveMaxRadius over the
//     shockwave window; strength spikes then fades.

const fragmentShader = /* glsl */`
uniform float uTime;
uniform vec2  uCenter;
uniform float uStrength;

uniform float uShockwaveRadius;
uniform float uShockwaveMaxRadius;
uniform float uShockwaveStrength;

void mainUv(inout vec2 uv) {
  vec2  dir  = uv - uCenter;
  float dist = length(dir);
  vec2  ndir = dist > 0.001 ? dir / dist : vec2(0.0);

  // ── Heat haze ──────────────────────────────────────────────────────────────
  float mask = smoothstep(0.30, 0.04, dist);
  if (mask > 0.001) {
    float wave = sin(dist * 32.0 - uTime * 7.0) * uStrength * mask;
    uv += ndir * wave;
  }

  // ── Shockwave ring ─────────────────────────────────────────────────────────
  if (uShockwaveStrength > 0.001 && uShockwaveMaxRadius > 0.001) {
    // Ring in UV space (normalised by aspect — handled by caller projecting 3D→UV)
    float ringDist = abs(dist - uShockwaveRadius);
    // Tight Gaussian: only pixels within ~2% of the ring radius are warped
    float ringMask = exp(-ringDist * ringDist * 8000.0);
    uv += ndir * ringMask * uShockwaveStrength;
  }
}
`

export class HeatDistortionEffect extends Effect {
  constructor() {
    super('HeatDistortionEffect', fragmentShader, {
      uniforms: new Map<string, Uniform<unknown>>([
        ['uTime',                new Uniform(0)],
        ['uCenter',              new Uniform(new Vector2(0.5, 0.5))],
        ['uStrength',            new Uniform(0)],
        ['uShockwaveRadius',     new Uniform(0)],
        ['uShockwaveMaxRadius',  new Uniform(0)],
        ['uShockwaveStrength',   new Uniform(0)],
      ]),
    })
  }
}
