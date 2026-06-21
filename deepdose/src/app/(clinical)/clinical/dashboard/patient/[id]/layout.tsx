import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  loadClinicalPatientHeader,
  requireClinicalPatientAccess,
} from '@/lib/clinical/patient-chart'
import { ClinicalPatientHeader } from '@/components/clinical/ClinicalPatientHeader'
import { ClinicalPatientNav } from '@/components/clinical/ClinicalPatientNav'

export default async function ClinicalPatientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/clinical/dashboard')
  }

  const canAccess = await requireClinicalPatientAccess(supabase, user.id, patientId)
  if (!canAccess) {
    notFound()
  }

  const header = await loadClinicalPatientHeader(supabase, patientId)
  if (!header) {
    notFound()
  }

  return (
    <div className="dash-meds space-y-8">
      <ClinicalPatientHeader header={header} />
      <ClinicalPatientNav patientId={patientId} />
      {children}
    </div>
  )
}
