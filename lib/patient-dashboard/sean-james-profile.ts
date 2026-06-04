import type { PatientProfileRow } from '@/lib/auth/require-patient'
import { chronologicalAgeFromDateOfBirth } from '@/lib/patient-dashboard/date-of-birth'

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

export { chronologicalAgeFromDateOfBirth }

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
