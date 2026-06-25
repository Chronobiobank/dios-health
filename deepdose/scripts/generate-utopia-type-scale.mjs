#!/usr/bin/env node
/**
 * Regenerate Utopia fluid type scale clamp() values for dios-tokens.css
 * Calculator: https://utopia.fyi/type/calculator
 *
 * Usage: node scripts/generate-utopia-type-scale.mjs
 */

const MIN_VW = 360
const MAX_VW = 1240
const ROOT = 16
const MIN_BASE = 16
const MAX_BASE = 18
const MIN_RATIO = 1.2
const MAX_RATIO = 1.25

function fluidClamp(minPx, maxPx) {
  const slope = (maxPx - minPx) / (MAX_VW - MIN_VW)
  const intercept = minPx - slope * MIN_VW
  const fmtRem = (px) => `${Math.round((px / ROOT) * 10000) / 10000}rem`
  const interceptRem = Math.round((intercept / ROOT) * 10000) / 10000
  const vw = Math.round(slope * 100 * 10000) / 10000
  return `clamp(${fmtRem(minPx)}, ${interceptRem}rem + ${vw}vw, ${fmtRem(maxPx)})`
}

const steps = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]

console.log('/* Utopia scale — paste into dios-tokens.css */')
console.log(`/* Config: ${MIN_VW}px → ${MAX_VW}px · ${MIN_BASE}px → ${MAX_BASE}px · ${MIN_RATIO} → ${MAX_RATIO} */`)
console.log()

for (const step of steps) {
  const minPx = MIN_BASE * MIN_RATIO ** step
  const maxPx = MAX_BASE * MAX_RATIO ** step
  console.log(`  --type-step-${step}: ${fluidClamp(minPx, maxPx)};`)
}

console.log(`  --type-display: ${fluidClamp(40, 76)};`)
