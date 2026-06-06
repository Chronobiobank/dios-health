import type { Metadata } from 'next'

import { FirstLightSession } from '@/components/first-light/first-light-session'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { normalizeSleepOnsetForApi } from '@/lib/retinomic/light-check-in'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import { resolveFirstLightWindow } from '@/lib/product/first-light-window'

import './first-light.css'

export const metadata: Metadata = {
  title: `${FIRST_LIGHT_PROTOCOL.name} — DIOS`,
  description: '60-second morning scan — body clock, safety checkpoints, and today’s dose windows.',
}

type FirstLightPageProps = {
  searchParams: Promise<{ late?: string }>
}

export default async function FirstLightPage({ searchParams }: FirstLightPageProps) {
  await requirePatientSession()
  const params = await searchParams
  const windowStatus = resolveFirstLightWindow()
  const allowLateScan = params.late === '1' || windowStatus.outsideEntrainment

  const defaultSleepOnset = normalizeSleepOnsetForApi('22:30')

  return (
    <FirstLightSession
      windowStatus={windowStatus}
      allowLateScan={allowLateScan}
      defaultWakeTime=""
      defaultSleepOnset={defaultSleepOnset}
    />
  )
}
