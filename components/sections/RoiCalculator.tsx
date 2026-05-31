'use client'

import { useMemo, useState } from 'react'

import { Card } from '@/components/ui/card'

import { BODY, CARD, CONTAINER, LABEL, SECTION, SECTION_TITLE } from './layout'
import { SectionLabel } from './SectionLabel'

const COST_PER_ADMISSION = 2800

const inputClassName =
  'type-body w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-black outline-none transition-colors placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black/10'

function formatGBP(value: number) {
  return `£${Math.round(value).toLocaleString('en-GB')}`
}

export function RoiCalculator() {
  const [patients, setPatients] = useState(500)

  const derived = useMemo(() => {
    const avoidableRate = 0.05
    const admissions = Math.max(0, Math.round(patients * avoidableRate))
    const annualCost = admissions * COST_PER_ADMISSION
    return { admissions, annualCost }
  }, [patients])

  return (
    <section className={`${SECTION} ${CONTAINER}`}>
      <SectionLabel title="Your ROI" />
      <h2 className={`${SECTION_TITLE} mt-4 max-w-2xl`}>What does wrong timing cost you?</h2>

      <Card className={`${CARD} mt-8 max-w-xl gap-0 rounded-2xl p-6 sm:p-8`}>
        <div>
          <label htmlFor="roi-patients" className={`${LABEL} mb-2 block`}>
            Number of patients or residents
          </label>
          <input
            id="roi-patients"
            name="patients"
            type="number"
            min={0}
            step={50}
            value={patients}
            onChange={(event) => setPatients(Number(event.target.value) || 0)}
            className={inputClassName}
          />
        </div>
        <dl className="mt-6 space-y-3 border-t border-black/10 pt-6">
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-black/60">Estimated avoidable admissions (5%)</dt>
            <dd className="font-medium tabular-nums text-black">{derived.admissions}</dd>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <dt className="text-black/60">Annual cost at wrong timing</dt>
            <dd className="type-mono text-lg font-semibold text-black">
              {formatGBP(derived.annualCost)}
            </dd>
          </div>
        </dl>
      </Card>

      <p className={`${BODY} mt-6 text-black/60`}>
        Based on NHS England data. {formatGBP(COST_PER_ADMISSION)} per avoidable admission.
      </p>
    </section>
  )
}
