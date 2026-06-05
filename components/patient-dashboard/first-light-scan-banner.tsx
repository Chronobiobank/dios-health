'use client'

import Link from 'next/link'

import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import type { FirstLightWindowStatus } from '@/lib/product/first-light-window'

type FirstLightScanBannerProps = {
  window: FirstLightWindowStatus
}

export function FirstLightScanBanner({ window: windowStatus }: FirstLightScanBannerProps) {
  if (!windowStatus.scanDue && !windowStatus.outsideEntrainment) return null

  return (
    <div
      className={
        windowStatus.scanDue
          ? 'first-light-banner first-light-banner--open'
          : 'first-light-banner first-light-banner--closed'
      }
      role="status"
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--calm-brand)]">
        {FIRST_LIGHT_PROTOCOL.name}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{windowStatus.message}</p>
      {windowStatus.scanDue ? (
        <Link href="/onboarding" className="dios-btn-on-light calm-auth-btn-primary mt-3 inline-block text-sm">
          Start {FIRST_LIGHT_PROTOCOL.scanDurationSeconds}s morning scan →
        </Link>
      ) : null}
    </div>
  )
}
