'use client'

import Link from 'next/link'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { CORPORATE_PEAK_WINDOW, CORPORATE_PROOF } from '@/lib/pitch/corporate-landing-content'
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
  const [executives, setExecutives] = useState<number>(CORPORATE_PROOF.defaults.executives)
  const [salaryK, setSalaryK] = useState<number>(CORPORATE_PROOF.defaults.salaryK)
  const [travelDays, setTravelDays] = useState<number>(CORPORATE_PROOF.defaults.travelDaysPerMonth)
  const [sector, setSector] = useState<CorporateSectorId>(CORPORATE_PROOF.defaults.sector)

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
    <div className="clq-roi__controls">
      <label className="clq-roi__field">
        <span className="clq-roi__label">
          Professionals — <strong>{inputs.executives}</strong>
        </span>
        <input
          type="range"
          min={10}
          max={500}
          step={10}
          value={inputs.executives}
          onChange={(e) => setExecutives(Number(e.target.value))}
          className="clq-roi__range"
        />
      </label>

      <label className="clq-roi__field">
        <span className="clq-roi__label">
          Avg salary — <strong>{formatGbp(inputs.salaryK * 1000)}</strong>
        </span>
        <input
          type="range"
          min={80}
          max={800}
          step={10}
          value={inputs.salaryK}
          onChange={(e) => setSalaryK(Number(e.target.value))}
          className="clq-roi__range"
        />
      </label>

      <label className="clq-roi__field">
        <span className="clq-roi__label">
          Travel days / month — <strong>{inputs.travelDaysPerMonth}</strong>
        </span>
        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={inputs.travelDaysPerMonth}
          onChange={(e) => setTravelDays(Number(e.target.value))}
          className="clq-roi__range"
        />
      </label>

      <fieldset className="clq-roi__field">
        <legend className="clq-roi__label">Sector</legend>
        <div className="clq-roi__sectors">
          {SECTORS.map((item) => (
            <label key={item.id} className="clq-roi__sector">
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
  const { inputs, result } = useRoiContext()
  const protectedHours = inputs.executives * CORPORATE_PEAK_WINDOW.hoursPerLeader

  return (
    <div className="clq-roi__results">
      <div className="clq-roi__peak">
        <p className="clq-roi__peak-ey">{CORPORATE_PEAK_WINDOW.eyebrow}</p>
        <p className="clq-roi__peak-title">{CORPORATE_PEAK_WINDOW.title}</p>
        <p className="clq-roi__peak-stat" aria-live="polite">
          {CORPORATE_PEAK_WINDOW.hoursPerLeader}h × {inputs.executives} professionals ={' '}
          <strong>{protectedHours.toLocaleString('en-GB')} protected hours / day</strong>
        </p>
      </div>

      <div className="clq-roi__cost">
        <p className="clq-roi__results-ey">Annual cost of circadian disruption</p>
        <p className="clq-roi__results-total" aria-live="polite">
          {formatGbp(result.totalCost, true)}
        </p>
        <p className="clq-roi__results-sub">
          Recover {formatGbp(result.recoverable, true)} by protecting Peak Window — not adding
          another wellness perk.
        </p>
      </div>

      <div className="clq-roi__recovery">
        <div>
          <p className="clq-roi__recovery-label">Recoverable</p>
          <p className="clq-roi__recovery-value">{formatGbp(result.recoverable, true)}</p>
        </div>
        <div>
          <p className="clq-roi__recovery-label">Programme</p>
          <p className="clq-roi__recovery-value">{formatGbp(result.diosProgrammeCost, true)}</p>
        </div>
        <div>
          <p className="clq-roi__recovery-label">ROI</p>
          <p className="clq-roi__recovery-value">{result.roiMultiple.toFixed(1)}×</p>
        </div>
      </div>

      <Link href={CORPORATE_PROOF.cta.href} className="clq-nav__cta clq-roi__cta">
        {CORPORATE_PROOF.cta.label}
      </Link>
    </div>
  )
}

export function CorporateProofEvidence() {
  return (
    <div aria-label="Evidence sources">
      <ul className="clq-citations">
        {CORPORATE_PROOF.citations.map((item) => (
          <li key={item.source}>
            <span className="clq-citations__source">{item.source}</span>
            <span className="clq-citations__quote">{item.quote}</span>
          </li>
        ))}
      </ul>
      <p className="clq-method">{CORPORATE_PROOF.methodology}</p>
    </div>
  )
}
