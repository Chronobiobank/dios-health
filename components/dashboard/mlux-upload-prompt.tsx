import Link from 'next/link'

import { DASHBOARD_BODY, DASHBOARD_CARD, SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'

export function MLuxUploadPrompt() {
  return (
    <section>
      <h2 className={SECTION_LABEL}>Your body clock</h2>
      <div className={`${DASHBOARD_CARD} mt-4 border-0 bg-neutral-950 px-5 py-10 text-center text-white shadow-sm`}>
        <p className="text-[15px] font-medium leading-snug">
          Upload your first TipTraQ EDF recording to calculate your body clock.
        </p>
        <p className={`${DASHBOARD_BODY} mt-3 text-white/60`}>
          One night gives an estimate. Confidence grows with each upload.
        </p>
        <Link
          href={PATIENT_ROUTES.streams}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition-transform duration-100 active:scale-[0.97] hover:bg-white/90"
        >
          Upload TipTraQ recording →
        </Link>
      </div>
    </section>
  )
}
