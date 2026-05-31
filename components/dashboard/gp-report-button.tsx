'use client'

import Link from 'next/link'

import { PATIENT_ROUTES } from '@/lib/auth/routes'

type GpReportButtonProps = {
  className?: string
}

export function GpReportButton({ className }: GpReportButtonProps) {
  return (
    <Link
      href={`${PATIENT_ROUTES.report}?print=1`}
      className={
        className ??
        'inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-black transition-colors hover:bg-black/5'
      }
    >
      Print GP report
    </Link>
  )
}
