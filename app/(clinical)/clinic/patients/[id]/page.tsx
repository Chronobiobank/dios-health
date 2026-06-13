import { notFound } from 'next/navigation'

import { ProtocolRequirementsPanel } from '@/components/fulfillment/protocol-requirements-panel'
import { BodyClockSummary } from '@/components/clinic/body-clock-summary'
import { DoseInsightCards } from '@/components/clinic/dose-insight-cards'
import { PatientStreamsStatus } from '@/components/clinic/patient-streams-status'
import { PatientTwinHeader } from '@/components/clinic/patient-twin-header'
import { PatientTwinTopBar } from '@/components/clinic/patient-twin-top-bar'
import { requireClinicianSession } from '@/lib/auth/require-clinician'
import { getDemoPatientTwin, getSortedInsights } from '@/lib/clinic/demo-patient-twin'
import { getRequirementsForCohortPatient } from '@/lib/fulfillment/service'
import { FULFILLMENT_ROUTES } from '@/lib/auth/routes'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ClinicPatientPage({ params }: Props) {
  await requireClinicianSession()
  const { id } = await params

  const patient = getDemoPatientTwin(id)
  if (!patient) {
    notFound()
  }

  const insights = getSortedInsights(patient)
  const requirements = await getRequirementsForCohortPatient('coimbra', patient.id)

  return (
    <>
      <PatientTwinTopBar patientId={patient.id} name={patient.name} age={patient.age} />
      <PatientTwinHeader patient={patient} />
      <ProtocolRequirementsPanel
        requirements={requirements}
        orderBaseHref={FULFILLMENT_ROUTES.clinicPatientOrder(patient.id)}
        patientId={patient.id}
      />
      <DoseInsightCards patientId={patient.id} insights={insights} />
      <PatientStreamsStatus streams={patient.streams} />
      <BodyClockSummary summary={patient.bodyClockSummary} />
    </>
  )
}
