// Shared environment constants — used by HeroScene (Canvas setup) and GridFloor (shader).
// Both must match so the grid dissolves seamlessly into the scene background.

// Background / fog colour — dark charcoal with a cool-neutral bias.
// Hex:          #181A1E
// RGB float:    [24/255, 26/255, 30/255]
export const ENV_BG_HEX      = 0x181a1e

// FogExp2 density.
// Three.js formula: fogFactor = 1 - exp(-density² × depth²)
// At depth 12 ≈ 42% fogged, depth 22 ≈ 81% fogged — good horizon dissolution.
export const ENV_FOG_DENSITY = 0.052

// Same colour as RGB floats [0..1] for the grid shader uniform.
export const ENV_FOG_R = 24  / 255   // 0.0941
export const ENV_FOG_G = 26  / 255   // 0.1020
export const ENV_FOG_B = 30  / 255   // 0.1176
