// src/app/risk/page.tsx
import { redirect } from 'next/navigation'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'

interface PageProps {
  searchParams: Promise<{ meds?: string; wake?: string }>
}

/** Legacy route — polypharmacy results live on patient landing. */
export default async function RiskPage({ searchParams }: PageProps) {
  const params = await searchParams
  const medCodes = (params.meds ?? '').split(',').filter(Boolean)
  const wake = params.wake ?? '07:30'

  if (!medCodes.length) {
    redirect('/')
  }

  redirect(buildPatientLandingPath({ medCodes, wake }))
}
