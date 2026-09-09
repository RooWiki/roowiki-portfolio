// Procedural perspective grid for the VFX stage floor.
//
// Architecture: transparent ShaderMaterial overlay sitting 3 mm above the
// opaque meshStandardMaterial ground plane.  The ground receives Three.js
// point-light illumination normally; the grid is layered on top and only
// draws the line pattern.
//
// Grid:
//   minor lines — 0.5 world-unit spacing, subtle luminance
//   major lines — 2.0 world-unit spacing, slightly brighter
//
// Anti-aliasing:
//   fwidth() on the grid coordinate gives derivatives in screen space.
//   This keeps lines exactly ~1 px wide at every depth — no shimmer.
//   Requires ShaderMaterial.extensions.derivatives = true (WebGL1 compat).
//
// Distance fade:
//   Alpha = gridIntensity × exp(−density² × depth²)
//   Matches Three.js FogExp2 formula exactly so the grid vanishes into the
//   background at the same rate as all other scene objects.

import { ENV_FOG_DENSITY, ENV_FOG_R, ENV_FOG_G, ENV_FOG_B } from './environmentConfig'

export const gridVertexShader = /* glsl */`
varying vec3  vWorldPos;
varying float vFogDepth;

void main() {
  vec4 wp   = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;

  // View-space depth used for fog matching (Three.js convention: -mvPos.z)
  vec4 mv   = modelViewMatrix * vec4(position, 1.0);
  vFogDepth = -mv.z;

  gl_Position = projectionMatrix * mv;
}
`

export const gridFragmentShader = /* glsl */`
// fwidth() requires GL_OES_standard_derivatives; enabled via material.extensions.
// In WebGL2 contexts Three.js uses, derivatives are available without pragma.

uniform float uFogDensity;
uniform vec3  uFogColor;

varying vec3  vWorldPos;
varying float vFogDepth;

// Anti-aliased line in one axis.
// Returns 0..1 where 1 = on the line centre, 0 = between lines.
float axisLine(float pos, float spacing) {
  float s  = pos / spacing;
  float fw = max(fwidth(s), 0.0001);   // guard against zero derivative
  float g  = abs(fract(s - 0.5) - 0.5);
  return 1.0 - smoothstep(fw * 0.4, fw * 1.6, g);
}

void main() {
  vec2 xz = vWorldPos.xz;

  // ── Minor lines: 0.5 unit grid ───────────────────────────────────────────
  float minorX = axisLine(xz.x, 0.5);
  float minorZ = axisLine(xz.y, 0.5);
  float minorGrid = max(minorX, minorZ);

  // ── Major lines: 2.0 unit grid ───────────────────────────────────────────
  float majorX = axisLine(xz.x, 2.0);
  float majorZ = axisLine(xz.y, 2.0);
  float majorGrid = max(majorX, majorZ);

  // Skip pixels that have no grid contribution
  if (minorGrid < 0.01 && majorGrid < 0.01) discard;

  // ── Fog-based distance fade ───────────────────────────────────────────────
  // Matches Three.js FogExp2: fogFactor = 1 − exp(−density² × depth²)
  // Survival factor (amount of original colour remaining):
  float survival  = exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);

  // Grid alpha fades exactly as the scene fog fades other objects
  float gridAlpha = survival;

  // ── Grid colours: cool neutral grays ─────────────────────────────────────
  // Major lines slightly brighter than minor to establish the coarse grid.
  // Both stay in the cool / neutral range — no warm orange here.
  vec3 minorColor = vec3(0.175, 0.188, 0.208);  // subtle cool gray
  vec3 majorColor = vec3(0.295, 0.318, 0.352);  // noticeably brighter

  // Blend: major takes priority where both land on the same pixel
  vec3 lineColor = mix(minorColor, majorColor, majorGrid);

  // Composite intensity: major contributes more opacity than minor
  float lineIntensity = max(minorGrid * 0.52, majorGrid * 0.90);

  float alpha = lineIntensity * gridAlpha;
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(lineColor, alpha);
}
`

// Static uniforms — set once at material creation, never mutated per frame.
export const GRID_UNIFORMS = {
  uFogDensity: { value: ENV_FOG_DENSITY },
  uFogColor:   { value: { x: ENV_FOG_R, y: ENV_FOG_G, z: ENV_FOG_B } },
} as const
