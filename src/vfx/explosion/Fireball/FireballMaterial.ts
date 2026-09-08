import { AdditiveBlending, NormalBlending, ShaderMaterial, Vector3 } from 'three'
import type { QualityTier } from '../../../lib/three/performanceConfig'
import {
  NOISE_SCALE,
  NOISE_STRENGTH,
  COLOR_HOT,
  COLOR_BRIGHT,
  COLOR_MID,
  COLOR_COOL,
  COLOR_DEAD,
} from './fireballConfig'

// ─── Vertex shader ────────────────────────────────────────────────────────────
// Three noise channels computed per-vertex and passed to the fragment stage:
//
//   vNoise    — domain-warped FBM driving vertex displacement AND fine thermal detail
//   vLowNoise — very-low-frequency noise for large thermal blobs (added in 3B)
//   vErosion  — medium-frequency noise used by the fragment to discard fragments,
//               creating genuine cavities, broken silhouettes, and flame-like gaps
//
// FBM_OCTAVES is injected as a #define for quality-tier scaling.

const vertexShader = /* glsl */`
uniform float uTime;
uniform float uSeed;
uniform float uNoiseScale;
uniform float uNoiseStrength;

varying float vNoise;
varying float vLowNoise;
varying float vErosion;
varying vec3  vViewNormal;

// ── Value noise ──────────────────────────────────────────────────────────────

float hash(vec3 p) {
  p = fract(p * vec3(127.1, 311.7, 74.7));
  p += dot(p, p.yxz + 19.19);
  return fract((p.x + p.y) * p.z);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix( mix(hash(i                ), hash(i + vec3(1,0,0)), u.x ),
         mix(hash(i + vec3(0,1,0)  ), hash(i + vec3(1,1,0)), u.x ), u.y ),
    mix( mix(hash(i + vec3(0,0,1)  ), hash(i + vec3(1,0,1)), u.x ),
         mix(hash(i + vec3(0,1,1)  ), hash(i + vec3(1,1,1)), u.x ), u.y ),
    u.z
  );
}

// FBM_OCTAVES is provided as a #define (see createFireballMaterial below)
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < FBM_OCTAVES; i++) {
    v += a * valueNoise(p);
    p  = p * 2.1 + vec3(5.2, 1.7, 3.4);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 seedOff = vec3(uSeed * 3.71, uSeed * 1.13, uSeed * 2.47);
  vec3 timeOff = vec3(uTime * 0.40, uTime * -0.25, uTime * 0.15);
  vec3 pBase   = position * uNoiseScale + seedOff + timeOff;

  // Domain-warped FBM for displacement — warp 1.45 produces strongly
  // curling turbulent billows; sharper normalization creates distinct ridges.
  float warpX = fbm(pBase);
  float warpY = fbm(pBase + vec3(4.3, 1.1, 2.9));
  float n     = fbm(pBase + vec3(warpX, warpY, 0.0) * 1.45);

  // n * 2.10 - 0.25: amplifies contrast between peaks and valleys.
  // Values below 0.119 (quiet surface) map to 0 (no displacement).
  float nNorm = clamp(n * 2.10 - 0.25, 0.0, 1.0);
  vec3 displaced = position + normal * nNorm * uNoiseStrength;

  // Low-frequency thermal blobs — very large scale, slow independent scroll.
  // Drives large hot/cool regions across each lobe surface.
  vec3 pLow = position * (uNoiseScale * 0.28) + seedOff * 0.7;
  pLow += vec3(uTime * 0.08, uTime * -0.05, uTime * 0.04);
  float ltA = valueNoise(pLow);
  float ltB = valueNoise(pLow * 1.9 + vec3(2.1, 0.7, 1.5));
  vLowNoise = clamp(ltA * 0.6 + ltB * 0.4, 0.0, 1.0);

  // Erosion noise — medium frequency, different seed offset and time scroll.
  // Coarse scale reduced 0.38→0.28: fewer, larger coherent cavities instead of
  // swiss-cheese texture. Upward scroll matches fireball buoyancy direction.
  vec3 pEr = position * (uNoiseScale * 0.55) + seedOff * 2.1;
  pEr += vec3(uTime * 0.10, uTime * 0.18, uTime * -0.07);
  float erFine   = valueNoise(pEr);
  float erCoarse = valueNoise(pEr * 0.28 + vec3(1.3, 2.7, -0.6));
  vErosion = clamp(erFine * 0.48 + erCoarse * 0.52, 0.0, 1.0);

  vNoise      = nNorm;
  vViewNormal = normalize(normalMatrix * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`

// ─── Fragment shader ──────────────────────────────────────────────────────────
// Two blending roles share this shader, controlled by uniforms:
//
//   Body lobes (NormalBlending):
//     uAlphaBase ≈ 0.78 — mostly opaque in non-eroded regions
//     uErosionThreshold > 0 — cavities carved by discard
//     uDepthFactor < 1 — rear lobes are dimmer
//
//   Core lobe (AdditiveBlending):
//     uAlphaBase ≈ 0.12 — very low alpha, accumulation provides the glow
//     uErosionThreshold ≈ 0 — minimal erosion, stays mostly intact
//     uDepthFactor = 1.0 — full brightness
//
// Temperature targets (at peak, body lobes, no accumulation):
//   white/near-white  ~5–10%  (vLowNoise very high AND fresh)
//   yellow            ~15–25% (fresh zones, moderate vLowNoise)
//   orange            ~40–50% (dominant — mid-life, mixed vLowNoise)
//   deep red / dark   ~25–35% (aging, eroded, rear lobes)

const fragmentShader = /* glsl */`
uniform float uLife;
uniform float uErosionThreshold;
uniform float uDepthFactor;
uniform float uAlphaBase;
uniform vec3  uColorHot;
uniform vec3  uColorBright;
uniform vec3  uColorMid;
uniform vec3  uColorCool;
uniform vec3  uColorDead;

varying float vNoise;
varying float vLowNoise;
varying float vErosion;
varying vec3  vViewNormal;

vec3 fireRamp(float t) {
  // t: 0.0 = hottest, 1.0 = coldest
  // Orange is the dominant zone (0.10 → 0.72 = 62% of range).
  // White-hot is kept to small accents (< 0.10).
  t = clamp(t, 0.0, 1.0);
  if (t < 0.10) return mix(uColorHot,    uColorBright, t / 0.10);
  if (t < 0.36) return mix(uColorBright, uColorMid,    (t - 0.10) / 0.26);
  if (t < 0.72) return mix(uColorMid,    uColorCool,   (t - 0.36) / 0.36);
                return mix(uColorCool,    uColorDead,   (t - 0.72) / 0.28);
}

void main() {
  // Rim: 0 = faces camera, 1 = edge-on.
  float rim = 1.0 - abs(vViewNormal.z);

  // Erosion: discard genuinely empty regions, soft-fade partial ones.
  // smoothstep width of 0.28 keeps edges billowing rather than aliased.
  // Slightly tighter transition width (0.24 vs 0.28): edge structure more readable.
  float erosionMask = smoothstep(uErosionThreshold, uErosionThreshold + 0.24, vErosion);
  if (erosionMask < 0.015) discard;

  // Temperature → color.
  // Low-freq thermal blobs (vLowNoise) are the dominant spatial term so that
  // each lobe has large visible hot and cool patches rather than uniform color.
  // Life drives overall shift from hot to dead; rim adds edge cooling.
  // Stronger thermal contrast: vLowNoise coefficient 0.36→0.40, rim 0.18→0.26.
  // Creates clearer hot-interior / cool-rim gradient visible on each lobe.
  float temp = uLife               * 0.52
             + (1.0 - vLowNoise)  * 0.40   // thermal blobs: wider hot/cool separation
             + (1.0 - vNoise)     * 0.08   // fine peaks slightly hotter
             + rim                * 0.26;  // stronger edge cooling

  vec3 color = fireRamp(temp) * uDepthFactor;

  // Alpha: age fade × noise-modulated density × rim softening × erosion.
  float alpha = (1.0 - uLife * uLife)
              * (uAlphaBase + vNoise * 0.15)
              * (1.0 - rim  * 0.50)
              * erosionMask;
  alpha = clamp(alpha, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates one ShaderMaterial for a single fireball lobe.
 * Called once per lobe via getMats() cache — never inside useFrame.
 *
 * isCore = true  → AdditiveBlending, low alphaBase — central glow accumulation
 * isCore = false → NormalBlending, high alphaBase — fire body with erosion
 */
export function createFireballMaterial(
  seed:             number,
  tier:             QualityTier,
  erosionThreshold: number,
  depthFactor:      number,
  alphaBase:        number,
  isCore:           boolean,
): ShaderMaterial {
  const fbmOctaves = tier === 'low' ? 2 : tier === 'medium' ? 3 : 4

  return new ShaderMaterial({
    defines: {
      FBM_OCTAVES: fbmOctaves,
    },
    uniforms: {
      uTime:             { value: 0 },
      uLife:             { value: 0 },
      uSeed:             { value: seed },
      uNoiseScale:       { value: NOISE_SCALE },
      uNoiseStrength:    { value: NOISE_STRENGTH },
      uErosionThreshold: { value: erosionThreshold },
      uDepthFactor:      { value: depthFactor },
      uAlphaBase:        { value: alphaBase },
      // Colors as Vector3 — no per-frame allocation
      uColorHot:    { value: new Vector3(...COLOR_HOT)    },
      uColorBright: { value: new Vector3(...COLOR_BRIGHT) },
      uColorMid:    { value: new Vector3(...COLOR_MID)    },
      uColorCool:   { value: new Vector3(...COLOR_COOL)   },
      uColorDead:   { value: new Vector3(...COLOR_DEAD)   },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite:  false,
    blending:    isCore ? AdditiveBlending : NormalBlending,
  })
}
