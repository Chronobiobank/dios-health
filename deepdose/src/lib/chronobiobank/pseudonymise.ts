// Pseudonymisation helpers for the Chronobiobank.
// Records carry coarse, non-identifying attributes only — never names, DOB,
// postcode, or patient_id. Age is generalised into bands.

export const RESEARCH_CONSENT_PURPOSES = ['icb_licensing', 'pharma_rd', 'academic'] as const
export type ResearchConsentPurpose = (typeof RESEARCH_CONSENT_PURPOSES)[number]

export function ageBandFromDob(dob: string | null): string | null {
  if (!dob) return null
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1
  if (age < 18) return 'under_18'
  if (age < 30) return '18-29'
  if (age < 40) return '30-39'
  if (age < 50) return '40-49'
  if (age < 60) return '50-59'
  if (age < 70) return '60-69'
  if (age < 80) return '70-79'
  return '80_plus'
}

export function timingShiftMinutes(
  prior: string | null,
  recommended: string | null
): number | null {
  if (!prior || !recommended) return null
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + (m || 0)
  }
  let diff = toMin(recommended) - toMin(prior)
  if (diff > 720) diff -= 1440
  if (diff < -720) diff += 1440
  return diff
}
