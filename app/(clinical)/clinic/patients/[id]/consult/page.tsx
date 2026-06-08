import { notFound } from 'next/navigation'

import { ConsultationMode } from '@/components/clinic/consultation-mode'
import { getClinicianSurname, requireClinicianSession } from '@/lib/auth/require-clinician'
import { getDemoPatientTwin } from '@/lib/clinic/demo-patient-twin'
import { getPrimaryInsight } from '@/lib/clinic/patient-instruction'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ClinicConsultPage({ params }: Props) {
  const { profile, clinician } = await requireClinicianSession()
  const { id } = await params

  const patient = getDemoPatientTwin(id)
  if (!patient) {
    notFound()
  }

  const insight = getPrimaryInsight(patient)
  const clinicianDisplayName = getClinicianSurname(
    profile.full_name ?? 'Clinician',
    clinician.family_name
  )

  return (
    <ConsultationMode
      patient={patient}
      insight={insight}
      clinicianDisplayName={clinicianDisplayName}
    />
  )
}
