// Volumetric fire + smoke raymarching shader.
//
// Architecture: a unit cube ([-0.5, 0.5]³) rendered with side=BackSide so the
// fragment always exists regardless of camera position.  The fragment shader
// casts a ray from cameraPosition through the fragment world position, clips
// the ray against the animated world-space AABB (uBoxMin / uBoxMax), then
// marches the ray accumulating emission (fire) and extinction (smoke).
//
// Density field: domain-warped FBM — a procedural 3-D noise evaluated at the
// animated position (upward drift).  Domain warping produces the turbulent,
// chaotic shapes of a real explosion without GPU fluid simulation.
//
// Temperature field: a radial heat gradient that peaks at the rising explosion
// centre, decays over time, and mixes with the density to create the
// fire → smoke transition.  High-temperature regions emit fire colour;
// low-temperature / late-time regions contribute dark smoke extinction.
//
// Uniforms driven each frame from VolumetricFire.tsx:
//   uBoxMin, uBoxMax  — world-space AABB (grows as fire expands)
//   uExplosionOrigin  — fixed world position
//   uSysT             — seconds since VOL_START
//   uFireNorm         — 0→1 over fire phase (controls fire fade-out)
//   uSmokeNorm        — 0→1 over smoke phase (controls smoke fade-in)
//   uExpRadius        — current explosion radius (world units)
//   uColorHot etc.    — fire/smoke colour ramp
//
// Defines injected per quality tier (ShaderMaterial.defines):
//   MAX_STEPS  — compile-time loop bound (96 / 64 / 32)
//   OCTAVES    — FBM octave count (4 / 3 / 2)

export const volumetricVertexShader = /* glsl */`
varying vec3 vWP;

void main() {
  vec4 wp  = modelMatrix * vec4(position, 1.0);
  vWP      = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const volumetricFragmentShader = /* glsl */`
// ── Built-in: Three.js injects cameraPosition automatically ─────────────────
// uniform vec3 cameraPosition;   (already provided by WebGLRenderer)

// ── Animated bounding box ────────────────────────────────────────────────────
uniform vec3  uBoxMin;
uniform vec3  uBoxMax;

// ── Explosion state ──────────────────────────────────────────────────────────
uniform vec3  uExplosionOrigin;
uniform float uSysT;          // time since ignition
uniform float uFireNorm;      // 0→1 over fire lifetime
uniform float uSmokeNorm;     // 0→1 over smoke fade-in
uniform float uExpRadius;     // current expanding radius (world units)

// ── Fire colour ramp ─────────────────────────────────────────────────────────
uniform vec3 uColorHot;       // white-yellow core
uniform vec3 uColorBright;    // bright yellow
uniform vec3 uColorMid;       // dominant orange
uniform vec3 uColorCool;      // deep red-orange
uniform vec3 uColorDead;      // dark ember

// ── Smoke colour ─────────────────────────────────────────────────────────────
uniform vec3 uSmokeColor;     // cold soot / dark gray

varying vec3 vWP;

// ────────────────────────────────────────────────────────────────────────────
// Noise functions
// ────────────────────────────────────────────────────────────────────────────

// Fast hash — avoids sin/cos for GPU precision safety
float hash3(vec3 p) {
  p = fract(p * vec3(0.10313, 0.10301, 0.09731));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

// Smooth value noise 3D (quintic interpolation)
float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(mix(hash3(i),                 hash3(i+vec3(1,0,0)), u.x),
        mix(hash3(i+vec3(0,1,0)),     hash3(i+vec3(1,1,0)), u.x), u.y),
    mix(mix(hash3(i+vec3(0,0,1)),     hash3(i+vec3(1,0,1)), u.x),
        mix(hash3(i+vec3(0,1,1)),     hash3(i+vec3(1,1,1)), u.x), u.y),
    u.z
  );
}

// FBM — signed output [-0.5, 0.5] (used for domain warp offsets)
float fbmSigned(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * (noise3(p) * 2.0 - 1.0);
    p  = p * 2.3 + vec3(47.12, 31.41, 23.72);
    a *= 0.5;
  }
  return v;   // range approx [-1, 1], practical range ~[-0.5, 0.5]
}

// FBM — unsigned output [0, 1]
float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * noise3(p);
    p  = p * 2.3 + vec3(47.12, 31.41, 23.72);
    a *= 0.5;
  }
  return v * 1.333;   // normalize so full-amplitude gives ~1
}

// ────────────────────────────────────────────────────────────────────────────
// Domain-warped density field
// Upward drift + double-warp creates turbulent fire shapes with natural cavities
// ────────────────────────────────────────────────────────────────────────────
float densityAt(vec3 wp) {
  float drift = uSysT * 0.82;

  // Base sampling scale: looser = chunkier billows
  vec3 p = wp * 0.68;
  p.y   -= drift;

  // First domain warp — large-scale structure
  vec3 q = vec3(
    fbmSigned(p),
    fbmSigned(p + vec3(4.31, 1.72, 2.93)),
    fbmSigned(p + vec3(8.60, 5.21, 6.14))
  );

  // Second domain warp — finer turbulence
  vec3 r = vec3(
    fbmSigned(p + q * 0.70 + vec3(0.0, -drift * 0.4, 0.0)),
    fbmSigned(p + q * 0.70 + vec3(3.11, 1.18, 2.07)),
    fbmSigned(p + q * 0.70 + vec3(7.49, 4.32, 5.78))
  );

  return clamp(fbm(p + r * 0.55 + vec3(0.0, -drift * 0.25, 0.0)), 0.0, 1.0);
}

// ────────────────────────────────────────────────────────────────────────────
// Fire colour ramp — temperature 0..1 → colour
// ────────────────────────────────────────────────────────────────────────────
vec3 fireRamp(float t) {
  if (t > 0.82) return mix(uColorBright, uColorHot,    (t - 0.82) / 0.18);
  if (t > 0.52) return mix(uColorMid,   uColorBright,  (t - 0.52) / 0.30);
  if (t > 0.22) return mix(uColorCool,  uColorMid,     (t - 0.22) / 0.30);
                return mix(uColorDead,  uColorCool,     t          / 0.22);
}

// ────────────────────────────────────────────────────────────────────────────
// Ray – AABB intersection  (world space)
// Returns vec2(tNear, tFar).  tFar < tNear means no intersection.
// ────────────────────────────────────────────────────────────────────────────
vec2 hitAABB(vec3 ro, vec3 rd) {
  vec3 t0 = (uBoxMin - ro) / rd;
  vec3 t1 = (uBoxMax - ro) / rd;
  vec3 tN = min(t0, t1);
  vec3 tF = max(t0, t1);
  return vec2(max(max(tN.x, tN.y), tN.z), min(min(tF.x, tF.y), tF.z));
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────
void main() {
  // Ray from camera through the back face of the box
  vec3 rd = normalize(vWP - cameraPosition);
  vec2 hit = hitAABB(cameraPosition, rd);

  if (hit.x > hit.y || hit.y < 0.0) discard;

  float tA      = max(hit.x, 0.001);
  float tB      = hit.y;
  float stepLen = (tB - tA) / float(MAX_STEPS);

  vec3  col = vec3(0.0);
  float T   = 1.0;   // transmittance (1 = fully transparent)

  for (int i = 0; i < MAX_STEPS; i++) {
    float t  = tA + (float(i) + 0.5) * stepLen;
    vec3  sp = cameraPosition + rd * t;

    // ── Radial envelope: keeps density inside the expanding fireball ────────
    float rise   = uSysT * 0.55;
    vec3  ctr    = uExplosionOrigin + vec3(0.0, rise, 0.0);
    float dist   = length(sp - ctr);
    float invRad = 1.0 / max(uExpRadius, 0.3);

    float sphereEnv = max(0.0, 1.0 - dist * invRad);
    sphereEnv = sphereEnv * sphereEnv;   // quadratic — sharper boundary

    // ── Density ─────────────────────────────────────────────────────────────
    float dens = densityAt(sp) * sphereEnv;
    if (dens < 0.04) continue;

    // ── Temperature: radial heat + noise contribution ─────────────────────
    float heat = exp(-dist * invRad * 2.2) * (1.0 - uFireNorm * 0.95);
    float temp = clamp(heat * 0.80 + dens * 0.20, 0.0, 1.0);

    // ── Fire emission (high-temperature regions) ──────────────────────────
    float fireW = max(0.0, temp - 0.10) * max(0.0, 1.0 - uFireNorm * 1.3);
    if (fireW > 0.0) {
      vec3 fCol = fireRamp(temp);
      // Brighter close to explosion centre, dimmer at fringe
      float emit = fireW * dens * stepLen * 7.5;
      col += T * fCol * emit;
    }

    // ── Smoke extinction + ambient in-scatter ─────────────────────────────
    // Smoke is density that survives after fire cools (low temp or late time)
    float smokeDens = dens * (0.25 + uSmokeNorm * 0.75) * (1.0 - temp * 0.65);
    float ext = smokeDens * stepLen * 3.2;
    T *= exp(-ext);

    // Warm in-scatter from residual fire glow, otherwise dark soot
    float glowW = max(0.0, heat * 1.8) * (1.0 - uFireNorm);
    vec3  ambSmoke = mix(uSmokeColor, vec3(0.28, 0.09, 0.02), glowW);
    col += T * ambSmoke * smokeDens * stepLen * 0.55;

    if (T < 0.008) break;
  }

  float alpha = clamp(1.0 - T, 0.0, 1.0);
  if (alpha < 0.004) discard;

  gl_FragColor = vec4(col, alpha);
}
`
