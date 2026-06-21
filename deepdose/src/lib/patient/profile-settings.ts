import type { ConsentPurpose, PatientConsent } from '@/lib/consent/dynamic-consent'

export type ProfileConsentRow = {
  code: string
  title: string
  isRequired: boolean
  active: boolean
}

export type LinkedClinician = {
  id: string
  displayName: string | null
}

export function buildProfileConsentRows(
  purposes: ConsentPurpose[],
  consents: PatientConsent[]
): ProfileConsentRow[] {
  return purposes.map((purpose) => {
    const record = consents.find((c) => c.purpose_code === purpose.code)
    const active = Boolean(record?.granted && !record?.withdrawn_at)

    return {
      code: purpose.code,
      title: purpose.title,
      isRequired: purpose.is_required,
      active,
    }
  })
}

export function consentRowMeta(row: ProfileConsentRow): string {
  if (row.isRequired) {
    return row.active ? 'Required · On' : 'Required · Off'
  }
  return row.active ? 'On' : 'Off'
}
