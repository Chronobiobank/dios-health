import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'

export function TipTraqPractitionerBanner() {
  return (
    <aside className="mt-8 rounded-xl border border-teal-light bg-teal-light/40 px-4 py-4 sm:px-5">
      <p className={SECTION_LABEL}>TipTraQ for VD3 practitioners</p>
      <p className="mt-2 font-ui text-ui-sm leading-relaxed text-black/75">
        PTH tells you where the patient is in the protocol once every 90 days. TipTraQ tells you
        whether the protocol is working every single night. The device turns a quarterly blood test
        into a nightly progress report.
      </p>
      <p className="mt-2 font-ui text-ui-sm text-black/55">
        Sleep staging breakdown — REM latency, stage 3, WASO — is the primary biomarker of pRGC
        function between lab appointments.
      </p>
    </aside>
  )
}
