// Volumetric fire + smoke raymarching shader — v2.
//
// Key improvements over v1:
//   - Noise-modulated ellipsoidal boundary: breaks up the sphere silhouette,
//     produces the lumpy, irregular fire mass with visible cavities
//   - Directional blast shape: taller than wide (aspect 1.35:1 Y vs XZ)
//   - Ground clip: density smoothly zeroed below explosion origin Y
//   - Height-based smoke illumination: warm glow at base, dark soot aloft
//   - Stronger fire contrast via softened core luminance boost

export const volumetricVertexShader = /* glsl */`
varying vec3 vWP;

void main() {
  vec4 wp  = modelMatrix * vec4(position, 1.0);
  vWP      = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const volumetricFragmentShader = /* glsl */`
// cameraPosition: injected by Three.js WebGLRenderer into all ShaderMaterials

// ── Animated bounding box ────────────────────────────────────────────────────
uniform vec3  uBoxMin;
uniform vec3  uBoxMax;

// ── Explosion state ──────────────────────────────────────────────────────────
uniform vec3  uExplosionOrigin;
uniform float uSysT;
uniform float uFireNorm;      // 0→1 over fire lifetime
uniform float uSmokeNorm;     // 0→1 over smoke fade-in
uniform float uExpRadius;     // current expanding radius

// ── Fire colour ramp ─────────────────────────────────────────────────────────
uniform vec3 uColorHot;
uniform vec3 uColorBright;
uniform vec3 uColorMid;
uniform vec3 uColorCool;
uniform vec3 uColorDead;

// ── Smoke colour ─────────────────────────────────────────────────────────────
uniform vec3 uSmokeColor;

varying vec3 vWP;

// ────────────────────────────────────────────────────────────────────────────
// Noise
// ────────────────────────────────────────────────────────────────────────────

float hash3(vec3 p) {
  p = fract(p * vec3(0.10313, 0.10301, 0.09731));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}

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

float fbmSigned(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * (noise3(p) * 2.0 - 1.0);
    p  = p * 2.3 + vec3(47.12, 31.41, 23.72);
    a *= 0.5;
  }
  return v;
}

float fbm(vec3 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * noise3(p);
    p  = p * 2.3 + vec3(47.12, 31.41, 23.72);
    a *= 0.5;
  }
  return v * 1.333;
}

// ────────────────────────────────────────────────────────────────────────────
// Domain-warped density
// ────────────────────────────────────────────────────────────────────────────
float densityAt(vec3 wp) {
  float drift = uSysT * 0.82;
  vec3 p = wp * 0.68;
  p.y   -= drift;

  vec3 q = vec3(
    fbmSigned(p),
    fbmSigned(p + vec3(4.31, 1.72, 2.93)),
    fbmSigned(p + vec3(8.60, 5.21, 6.14))
  );

  vec3 r = vec3(
    fbmSigned(p + q * 0.70 + vec3(0.0, -drift * 0.4, 0.0)),
    fbmSigned(p + q * 0.70 + vec3(3.11, 1.18, 2.07)),
    fbmSigned(p + q * 0.70 + vec3(7.49, 4.32, 5.78))
  );

  return clamp(fbm(p + r * 0.55 + vec3(0.0, -drift * 0.25, 0.0)), 0.0, 1.0);
}

// ────────────────────────────────────────────────────────────────────────────
// Fire colour ramp
// ────────────────────────────────────────────────────────────────────────────
vec3 fireRamp(float t) {
  if (t > 0.82) return mix(uColorBright, uColorHot,    (t - 0.82) / 0.18);
  if (t > 0.52) return mix(uColorMid,   uColorBright,  (t - 0.52) / 0.30);
  if (t > 0.22) return mix(uColorCool,  uColorMid,     (t - 0.22) / 0.30);
                return mix(uColorDead,  uColorCool,     t          / 0.22);
}

// ────────────────────────────────────────────────────────────────────────────
// Ray – AABB intersection
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
  vec3 rd  = normalize(vWP - cameraPosition);
  vec2 hit = hitAABB(cameraPosition, rd);
  if (hit.x > hit.y || hit.y < 0.0) discard;

  float tA      = max(hit.x, 0.001);
  float tB      = hit.y;
  float stepLen = (tB - tA) / float(MAX_STEPS);

  vec3  col = vec3(0.0);
  float T   = 1.0;

  for (int i = 0; i < MAX_STEPS; i++) {
    float t  = tA + (float(i) + 0.5) * stepLen;
    vec3  sp = cameraPosition + rd * t;

    // ── Rising explosion centre ──────────────────────────────────────────────
    float rise = uSysT * 0.55;
    vec3  ctr  = uExplosionOrigin + vec3(0.0, rise, 0.0);
    vec3  rel  = sp - ctr;

    // ── Noise-modulated ellipsoidal boundary ─────────────────────────────────
    // Ellipse: taller than wide (Y scaled down = blast reads taller)
    float ASPECT = 1.35;
    vec3  scaled = vec3(rel.x, rel.y / ASPECT, rel.z);
    float dist   = length(scaled);

    // Low-frequency boundary perturbation — breaks sphere into lumps
    float boundary = noise3(sp * 0.18 + vec3(0.0, -uSysT * 0.3, 0.0));
    float effRad   = max(uExpRadius * (0.72 + boundary * 0.56), 0.3);
    float invRad   = 1.0 / effRad;

    float sphereEnv = max(0.0, 1.0 - dist * invRad);
    sphereEnv = sphereEnv * sphereEnv;

    // ── Ground clip: no fire underground ─────────────────────────────────────
    float groundClip = smoothstep(uExplosionOrigin.y - 0.15, uExplosionOrigin.y + 0.55, sp.y);

    // ── Density ──────────────────────────────────────────────────────────────
    float dens = densityAt(sp) * sphereEnv * groundClip;
    if (dens < 0.04) continue;

    // ── Temperature ──────────────────────────────────────────────────────────
    // Hot near origin, cools radially + temporally
    float radHeat  = exp(-dist * invRad * 2.0) * (1.0 - uFireNorm * 0.95);
    float temp     = clamp(radHeat * 0.82 + dens * 0.18, 0.0, 1.0);

    // ── Fire emission ─────────────────────────────────────────────────────────
    float fireW = max(0.0, temp - 0.08) * max(0.0, 1.0 - uFireNorm * 1.25);
    if (fireW > 0.0) {
      // Core brightness boost: hotter in the inner quarter
      float coreLum = max(0.0, 1.0 - dist * invRad * 3.5);
      vec3  fCol    = fireRamp(temp + coreLum * 0.15);
      col += T * fCol * fireW * dens * stepLen * 8.0;
    }

    // ── Smoke extinction + height-aware in-scatter ────────────────────────────
    float smokeDens = dens * (0.22 + uSmokeNorm * 0.78) * (1.0 - temp * 0.70);
    T *= exp(-smokeDens * stepLen * 3.4);

    // Smoke illumination: warm ember glow near base, dark soot aloft
    float height    = clamp((sp.y - uExplosionOrigin.y) / 4.5, 0.0, 1.0);
    float glowW     = max(0.0, radHeat * 1.6) * (1.0 - uFireNorm);
    vec3  baseGlow  = mix(uSmokeColor, vec3(0.32, 0.11, 0.02), glowW);
    vec3  smokeAmb  = mix(baseGlow, uSmokeColor * 0.4, height * uSmokeNorm);
    col += T * smokeAmb * smokeDens * stepLen * 0.55;

    if (T < 0.008) break;
  }

  float alpha = clamp(1.0 - T, 0.0, 1.0);
  if (alpha < 0.004) discard;

  gl_FragColor = vec4(col, alpha);
}
`
