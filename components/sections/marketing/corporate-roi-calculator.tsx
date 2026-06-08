'use client'

import Link from 'next/link'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { CORPORATE_ROI } from '@/lib/pitch/corporate-landing-content'
import {
  calculateCorporateRoi,
  formatGbp,
  type CorporateRoiBreakdown,
  type CorporateRoiInputs,
  type CorporateSectorId,
} from '@/lib/pitch/corporate-roi-model'

const SECTORS: { id: CorporateSectorId; label: string }[] = [
  { id: 'corporate', label: 'Corporate' },
  { id: 'professional', label: 'Professional services' },
  { id: 'banking', label: 'Banking / PE' },
]

type RoiContextValue = {
  inputs: CorporateRoiInputs
  result: CorporateRoiBreakdown
  setExecutives: (value: number) => void
  setSalaryK: (value: number) => void
  setTravelDays: (value: number) => void
  setSector: (value: CorporateSectorId) => void
}

const RoiContext = createContext<RoiContextValue | null>(null)

function useRoiContext() {
  const ctx = useContext(RoiContext)
  if (!ctx) throw new Error('CorporateRoiCalculator requires RoiProvider')
  return ctx
}

export function CorporateRoiProvider({ children }: { children: ReactNode }) {
  const [executives, setExecutives] = useState<number>(CORPORATE_ROI.defaults.executives)
  const [salaryK, setSalaryK] = useState<number>(CORPORATE_ROI.defaults.salaryK)
  const [travelDays, setTravelDays] = useState<number>(CORPORATE_ROI.defaults.travelDaysPerMonth)
  const [sector, setSector] = useState<CorporateSectorId>(CORPORATE_ROI.defaults.sector)

  const inputs = useMemo(
    () => ({ executives, salaryK, travelDaysPerMonth: travelDays, sector }),
    [executives, salaryK, travelDays, sector],
  )

  const result = useMemo(() => calculateCorporateRoi(inputs), [inputs])

  return (
    <RoiContext.Provider
      value={{
        inputs,
        result,
        setExecutives,
        setSalaryK,
        setTravelDays,
        setSector,
      }}
    >
      {children}
    </RoiContext.Provider>
  )
}

export function CorporateRoiControls() {
  const { inputs, setExecutives, setSalaryK, setTravelDays, setSector } = useRoiContext()

  return (
    <div className="kz-roi__controls">
      <label className="kz-roi__field">
        <span className="kz-roi__label">
          Executives — <strong>{inputs.executives}</strong>
        </span>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={inputs.executives}
          onChange={(e) => setExecutives(Number(e.target.value))}
          className="kz-roi__range"
        />
      </label>

      <label className="kz-roi__field">
        <span className="kz-roi__label">
          Avg salary — <strong>{formatGbp(inputs.salaryK * 1000)}</strong>
        </span>
        <input
          type="range"
          min={80}
          max={800}
          step={10}
          value={inputs.salaryK}
          onChange={(e) => setSalaryK(Number(e.target.value))}
          className="kz-roi__range"
        />
      </label>

      <label className="kz-roi__field">
        <span className="kz-roi__label">
          Travel days / month — <strong>{inputs.travelDaysPerMonth}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={inputs.travelDaysPerMonth}
          onChange={(e) => setTravelDays(Number(e.target.value))}
          className="kz-roi__range"
        />
      </label>

      <fieldset className="kz-roi__field">
        <legend className="kz-roi__label">Sector</legend>
        <div className="kz-roi__sectors">
          {SECTORS.map((item) => (
            <label key={item.id} className="kz-roi__sector">
              <input
                type="radio"
                name="sector"
                value={item.id}
                checked={inputs.sector === item.id}
                onChange={() => setSector(item.id)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

export function CorporateRoiResults() {
  const { result } = useRoiContext()

  return (
    <div className="kz-roi__results kz-roi__results--card">
      <p className="kz-roi__results-ey">Annual cost of circadian disruption</p>
      <p className="kz-roi__results-total kz-tabular" aria-live="polite">
        {formatGbp(result.totalCost, true)}
      </p>
      <p className="kz-roi__results-sub">leadership team · measurable misalignment</p>

      <div className="kz-roi__recovery">
        <div>
          <p className="kz-roi__recovery-label">Recoverable</p>
          <p className="kz-roi__recovery-value kz-tabular">{formatGbp(result.recoverable, true)}</p>
        </div>
        <div>
          <p className="kz-roi__recovery-label">Programme</p>
          <p className="kz-roi__recovery-value kz-tabular">
            {formatGbp(result.diosProgrammeCost, true)}
          </p>
        </div>
        <div>
          <p className="kz-roi__recovery-label">ROI</p>
          <p className="kz-roi__recovery-value kz-tabular">{result.roiMultiple.toFixed(1)}×</p>
        </div>
      </div>

      <Link href={CORPORATE_ROI.ctas.primary.href} className="kz-cta-btn kz-roi__cta">
        {CORPORATE_ROI.ctas.primary.label}
      </Link>
    </div>
  )
}
