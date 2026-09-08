// Pure timing functions — no React, no allocations, safe to call every frame.
// All functions take raw time values (seconds) and return a [0, 1] scalar.

/**
 * Returns elapsed time within the current cycle.
 */
export function getCycleTime(elapsed: number, cycleDuration: number): number {
  return elapsed % cycleDuration
}

/**
 * Smoothstep rise from 0 to 1 over [0, attackEnd],
 * then smoothstep fall from 1 to 0 over [attackEnd, decayEnd].
 */
export function envelope(t: number, attackEnd: number, decayEnd: number): number {
  if (t <= 0 || t >= decayEnd) return 0
  if (t < attackEnd) {
    const x = t / attackEnd
    return x * x * (3 - 2 * x)
  }
  const x = (t - attackEnd) / (decayEnd - attackEnd)
  return 1 - x * x * (3 - 2 * x)
}

/**
 * Linear rise to peakTime, then quadratic (ease-out) decay to decayEnd.
 * Produces a sharper, more impulsive shape than envelope().
 */
export function sharpEnvelope(t: number, peakTime: number, decayEnd: number): number {
  if (t <= 0 || t >= decayEnd) return 0
  if (t <= peakTime) return t / peakTime
  const x = (t - peakTime) / (decayEnd - peakTime)
  return (1 - x) * (1 - x)
}

/**
 * Exponential decay starting immediately from 1.
 * halfLife: time in seconds for the value to reach 0.5.
 */
export function expDecay(t: number, halfLife: number): number {
  if (t <= 0) return 1
  return Math.pow(0.5, t / halfLife)
}
