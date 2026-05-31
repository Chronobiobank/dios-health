'use client'

import { useState } from 'react'

import Link from 'next/link'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

type InsightsGpActionsProps = {
  canShareReport: boolean
}

export function InsightsGpActions({ canShareReport }: InsightsGpActionsProps) {
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  async function handleShare() {
    const reportUrl = `${window.location.origin}${PATIENT_ROUTES.report}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'DIOS Health — circadian timing summary',
          text: 'My body clock and medication timing summary from DIOS Health.',
          url: reportUrl,
        })
        return
      }

      await navigator.clipboard.writeText(reportUrl)
      setShareMessage('Report link copied — paste into a message for your GP.')
    } catch {
      setShareMessage('Could not share. Open the GP report and print or save as PDF.')
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href={`${PATIENT_ROUTES.report}?print=1`}
          className="flex min-h-[3.75rem] items-center justify-center rounded-2xl bg-black px-6 py-4 text-center text-base font-medium text-white transition-transform duration-100 active:scale-[0.98] hover:bg-black/90"
        >
          Print GP report
        </Link>
        <button
          type="button"
          disabled={!canShareReport}
          onClick={() => void handleShare()}
          className="flex min-h-[3.75rem] items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-4 text-center text-base font-medium text-black transition-transform duration-100 active:scale-[0.98] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Share results
        </button>
      </div>

      <p className="mt-6 text-center font-mono text-xs leading-relaxed text-black/50">
        Your GP can order a full DLMO blood test to confirm these results.
      </p>

      {shareMessage ? (
        <p role="status" className="mt-3 text-center text-sm text-black/60">
          {shareMessage}
        </p>
      ) : null}

      {!canShareReport ? (
        <p className="mt-3 text-center text-sm text-black/45">
          Upload a TipTraQ recording to generate a shareable GP summary.
        </p>
      ) : null}
    </div>
  )
}
