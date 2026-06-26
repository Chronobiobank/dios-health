// src/app/profile/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { PatientDashboard } from '@/components/deepdose/PatientDashboard'

export const metadata: Metadata = {
  title: `My timing profile · ${DEEPDOSE_NAME}`,
  description: 'Your personal circadian medication timing dashboard — powered by Deepdose.',
  alternates: { canonical: '/profile' },
}

interface PageProps {
  searchParams: Promise<{ meds?: string; times?: string; wake?: string }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const params = await searchParams
  const medCodes = (params.meds ?? '').split(',').filter(Boolean)
  const medTimes = (params.times ?? '').split(',').filter(Boolean)
  const wake = params.wake ?? '07:30'

  if (!medCodes.length) {
    return (
      <div className="min-h-full bg-canvas flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <p className="text-sm text-ink-muted">No profile data found.</p>
        <Link href="/" className="dios-btn-primary">
          ← Check my medications
        </Link>
      </div>
    )
  }

  return <PatientDashboard medCodes={medCodes} medTimes={medTimes} wake={wake} />
}
