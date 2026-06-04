import type { PatientProfileRow } from '@/lib/auth/require-patient'

/** NZ format 17/07/1978 → ISO calendar date. */
export const SEAN_JAMES_DATE_OF_BIRTH = '1978-07-17'

export function isSeanJamesPatient(
  patient: Pick<PatientProfileRow, 'first_name' | 'family_name'>
): boolean {
  return (
    patient.first_name?.trim().toLowerCase() === 'sean' &&
    patient.family_name?.trim().toLowerCase() === 'james'
  )
}

/** Whole years lived — matches birth-certificate age (no decimals). */
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

export function seanJamesChronologicalAge(asOf?: Date): number {
  return chronologicalAgeFromDateOfBirth(SEAN_JAMES_DATE_OF_BIRTH, asOf)
}

export function resolveChronologicalAge(
  patient: Pick<PatientProfileRow, 'first_name' | 'family_name' | 'age' | 'date_of_birth'>
): number {
  if (patient.date_of_birth) {
    return chronologicalAgeFromDateOfBirth(patient.date_of_birth)
  }
  if (isSeanJamesPatient(patient)) {
    return seanJamesChronologicalAge()
  }
  return patient.age ?? 58
}

/** Profile fields applied for Sean James (demo + signed-in). */
export function seanJamesProfilePatch(
  patient: PatientProfileRow
): PatientProfileRow {
  if (!isSeanJamesPatient(patient)) return patient
  const age = seanJamesChronologicalAge()
  return {
    ...patient,
    age,
    date_of_birth: patient.date_of_birth ?? SEAN_JAMES_DATE_OF_BIRTH,
    fitzpatrick_type: 2,
    location_city: 'Auckland',
    location_country: patient.location_country ?? 'New Zealand',
  }
}
