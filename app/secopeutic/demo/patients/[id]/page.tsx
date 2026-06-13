import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SecopeuticDemoShell } from '@/components/secopeutic/secopeutic-demo-shell'
import { SecopeuticPatientDetail } from '@/components/secopeutic/secopeutic-patient-detail'
import { getSecopeuticDemoPatient } from '@/lib/secopeutic/demo-cohort'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const patient = getSecopeuticDemoPatient(id)
  if (!patient) return { title: 'Patient not found' }

  return {
    title: `${patient.displayName} · Secopeutic demo`,
    robots: { index: false, follow: false },
  }
}

export default async function SecopeuticDemoPatientPage({ params }: Props) {
  const { id } = await params
  const patient = getSecopeuticDemoPatient(id)
  if (!patient) notFound()

  return (
    <SecopeuticDemoShell context={patient.recordId} variant="dark">
      <SecopeuticPatientDetail patient={patient} />
    </SecopeuticDemoShell>
  )
}
