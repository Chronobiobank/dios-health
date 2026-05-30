import Link from 'next/link'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export function DlmoUploadPrompt() {
  return (
    <section className="mt-8">
      <h2 className={SECTION_LABEL}>Your body clock</h2>
      <div className="mt-4 rounded-2xl border-[0.5px] border-black/[0.08] bg-neutral-950 px-6 py-10 text-center text-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <p className="text-lg font-medium leading-snug">
          Upload your first TipTraQ report to calculate your body clock.
        </p>
        <p className="mt-2 text-sm text-white/55">
          One night gives an estimate. Confidence grows with each upload.
        </p>
        <Link
          href={PATIENT_ROUTES.streams}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition-transform duration-100 active:scale-[0.97] hover:bg-white/90"
        >
          Upload TipTraQ report →
        </Link>
      </div>
    </section>
  )
}
