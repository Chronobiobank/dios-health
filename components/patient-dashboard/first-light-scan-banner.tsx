'use client'

import Link from 'next/link'

import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import type { FirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import type { FirstLightWindowStatus } from '@/lib/product/first-light-window'

type FirstLightScanBannerProps = {
  window: FirstLightWindowStatus
  dailyStatus?: FirstLightDailyStatus | null
}

function formatCompletedTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'today'
  return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function FirstLightScanBanner({ window: windowStatus, dailyStatus = null }: FirstLightScanBannerProps) {
  if (dailyStatus?.completeToday) {
    const isAmber = dailyStatus.riskStatus === 'amber'
    return (
      <div
        className={
          isAmber
            ? 'first-light-banner first-light-banner--amber'
            : 'first-light-banner first-light-banner--complete'
        }
        role="status"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--calm-brand)]">
          {FIRST_LIGHT_PROTOCOL.name}
        </p>
        <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
          {isAmber
            ? `Morning scan recorded at ${formatCompletedTime(dailyStatus.completedAt ?? '')} — safety checkpoints incomplete.`
            : `Scan complete today at ${formatCompletedTime(dailyStatus.completedAt ?? '')} — dose windows updated.`}
        </p>
        {dailyStatus.scanNote ? (
          <p className="mt-1 text-xs text-[var(--text-muted)]">{dailyStatus.scanNote}</p>
        ) : null}
        {isAmber && dailyStatus.missedCheckpoints.length > 0 ? (
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Open: {dailyStatus.missedCheckpoints.join(' · ')}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {isAmber ? (
            <Link
              href={PATIENT_ROUTES.firstLight}
              className="dios-btn-on-light calm-auth-btn-primary inline-block text-sm"
            >
              Complete checkpoints →
            </Link>
          ) : (
            <Link
              href={PATIENT_ROUTES.firstLightComplete}
              className="dios-btn-on-light--secondary inline-block text-sm"
            >
              View today&apos;s outputs →
            </Link>
          )}
        </div>
      </div>
    )
  }

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
      <div className="mt-3 flex flex-wrap gap-2">
        {windowStatus.scanDue ? (
          <Link
            href={PATIENT_ROUTES.firstLight}
            className="dios-btn-on-light calm-auth-btn-primary inline-block text-sm"
          >
            Start {FIRST_LIGHT_PROTOCOL.scanDurationSeconds}s morning scan →
          </Link>
        ) : null}
        {windowStatus.outsideEntrainment ? (
          <Link
            href={`${PATIENT_ROUTES.firstLight}?late=1`}
            className="dios-btn-on-light--secondary inline-block text-sm"
          >
            Scan anyway →
          </Link>
        ) : null}
      </div>
    </div>
  )
}
