/** ISO date YYYY-MM-DD → whole years lived (birth-certificate style). */
export function chronologicalAgeFromDateOfBirth(
  dateOfBirthIso: string,
  asOf: Date = new Date()
): number {
  const [y, m, d] = dateOfBirthIso.split('-').map(Number)
  if (!y || !m || !d) return 0
  let age = asOf.getFullYear() - y
  const beforeBirthday =
    asOf.getMonth() + 1 < m || (asOf.getMonth() + 1 === m && asOf.getDate() < d)
  if (beforeBirthday) age -= 1
  return Math.max(0, age)
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Validates DOB for signup/chronoprofile — returns derived age or error message. */
export function validatePatientDateOfBirth(
  dateOfBirthIso: string,
  asOf: Date = new Date()
): { ok: true; age: number } | { ok: false; message: string } {
  const trimmed = dateOfBirthIso.trim()
  if (!ISO_DATE_RE.test(trimmed)) {
    return { ok: false, message: 'Enter your date of birth.' }
  }

  const [y, m, d] = trimmed.split('-').map(Number)
  const dob = new Date(y, m - 1, d)
  if (
    dob.getFullYear() !== y ||
    dob.getMonth() !== m - 1 ||
    dob.getDate() !== d
  ) {
    return { ok: false, message: 'Enter a valid date of birth.' }
  }

  const today = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate())
  if (dob > today) {
    return { ok: false, message: 'Date of birth cannot be in the future.' }
  }

  const age = chronologicalAgeFromDateOfBirth(trimmed, asOf)
  if (age < 13) {
    return { ok: false, message: 'You must be at least 13 to use DIOS.' }
  }
  if (age > 120) {
    return { ok: false, message: 'Enter a valid date of birth.' }
  }

  return { ok: true, age }
}

/** `input[type=date]` max attribute (today, local). */
export function maxDateOfBirthInputValue(asOf: Date = new Date()): string {
  const y = asOf.getFullYear()
  const m = String(asOf.getMonth() + 1).padStart(2, '0')
  const d = String(asOf.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Earliest DOB allowing age ≤ 120. */
export function minDateOfBirthInputValue(asOf: Date = new Date()): string {
  return `${asOf.getFullYear() - 120}-01-01`
}
