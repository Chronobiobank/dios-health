'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { DASHBOARD_BODY, MONO_DATA, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

type StreamRow = {
  name: string
  fill: number
  status: string
  href?: string
  actionLabel?: string
}

type StreamsStatusProps = {
  tipTraqNightsCount?: number
  bloodPanelsCount?: number
  smartphoneActive?: boolean
}

export function StreamsStatus({
  tipTraqNightsCount = 0,
  bloodPanelsCount = 0,
  smartphoneActive = false,
}: StreamsStatusProps) {
  const tipTraqLive = tipTraqNightsCount > 0
  const cityLabsConnected = bloodPanelsCount > 0

  const streams: StreamRow[] = [
    {
      name: 'TipTraQ',
      fill: tipTraqLive ? 0.85 : 0,
      status: tipTraqLive ? 'Connected · Live' : 'Not connected',
      href: tipTraqLive ? undefined : PATIENT_ROUTES.streams,
      actionLabel: tipTraqLive ? undefined : 'Connect →',
    },
    {
      name: 'City Labs',
      fill: cityLabsConnected ? 0.7 : 0,
      status: cityLabsConnected ? 'Connected' : 'Not connected',
      href: PATIENT_ROUTES.streamsBloods,
      actionLabel: 'Enter results →',
    },
    {
      name: 'Smartphone',
      fill: smartphoneActive ? 0.55 : 0.12,
      status: smartphoneActive ? 'Active' : 'Not active',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
    >
      <h2 className={SECTION_LABEL}>Your data streams</h2>

      <ul className="mt-4 space-y-5">
        {streams.map((stream) => (
          <li key={stream.name}>
            <div className="flex items-center justify-between gap-4">
              <p className={`${DASHBOARD_BODY} w-24 shrink-0 font-medium text-black`}>{stream.name}</p>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-teal-600 transition-all duration-200 ease-out"
                  style={{ width: `${Math.round(stream.fill * 100)}%` }}
                />
              </div>
              <div className="min-w-[7rem] text-right">
                <p className={MONO_DATA}>{stream.status}</p>
                {stream.href && stream.actionLabel ? (
                  <Link href={stream.href} className={`${MONO_DATA} hover:text-black/70`}>
                    {stream.actionLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}
