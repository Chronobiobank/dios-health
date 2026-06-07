import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import {
  INTELLIGENCE_LAYER_SUMMARY,
  TIPTRAQ_CALIBRATION,
  TIPTRAQ_POSITIONING,
} from '@/lib/product/intelligence-cadence'

export function TipTraqPractitionerBanner() {
  return (
    <aside className="mt-8 rounded-xl border border-teal-light bg-teal-light/40 px-4 py-4 sm:px-5">
      <p className={SECTION_LABEL}>Four cadences for VD3 practice</p>
      <p className="mt-2 font-ui text-ui-sm leading-relaxed text-black/75">
        {TIPTRAQ_POSITIONING} {TIPTRAQ_CALIBRATION.summary}
      </p>
      <p className="mt-2 font-ui text-ui-sm text-black/55">{INTELLIGENCE_LAYER_SUMMARY}</p>
    </aside>
  )
}
