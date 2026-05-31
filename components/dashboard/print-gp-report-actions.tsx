'use client'

import { useEffect } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

type PrintGpReportActionsProps = {
  canPrint: boolean
}

export function PrintGpReportActions({ canPrint }: PrintGpReportActionsProps) {
  const searchParams = useSearchParams()
  const autoPrint = searchParams.get('print') === '1'

  useEffect(() => {
    if (autoPrint && canPrint) {
      window.print()
    }
  }, [autoPrint, canPrint])

  return (
    <div className="gp-report-actions mx-auto flex max-w-[48rem] flex-wrap gap-3 px-6 pb-8 pt-6 sm:px-10">
      <Link
        href={PATIENT_ROUTES.dashboard}
        className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5"
      >
        ← Back to dashboard
      </Link>
      {canPrint ? (
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-transform duration-100 active:scale-[0.97]"
        >
          Print report
        </button>
      ) : null}
    </div>
  )
}
