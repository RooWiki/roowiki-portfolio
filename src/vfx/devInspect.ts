// Dev-only VFX inspection overrides — driven by URL query params, never visible in prod.
// Usage: ?vfxTime=2.5&vfxSolo=fire&vfxQuality=high
//
// ?vfxTime=N   — freeze the clock at N seconds (float)
// ?vfxSolo=X   — show only one system: fire | smoke | sparks | streaks | debris | dust | shockwave | all
// ?vfxQuality=X — override quality tier: high | medium | low

const IS_DEV = import.meta.env.DEV

function param(key: string): string | null {
  if (!IS_DEV) return null
  try {
    return new URLSearchParams(window.location.search).get(key)
  } catch {
    return null
  }
}

export function getDevVfxTime(): number | null {
  const v = param('vfxTime')
  if (v === null) return null
  const n = parseFloat(v)
  return isNaN(n) ? null : n
}

export function getDevVfxSolo(): string | null {
  return param('vfxSolo')
}

export function getDevVfxQuality(): string | null {
  return param('vfxQuality')
}

// Returns true when a specific system should render.
// If vfxSolo is not set, all systems render.
export function systemVisible(name: string): boolean {
  const solo = getDevVfxSolo()
  if (!solo || solo === 'all') return true
  return solo === name
}
