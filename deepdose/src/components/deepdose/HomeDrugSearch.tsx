'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  buildMedicationRecommendation,
  searchMedicationCatalog,
  type MedicationRecommendation,
} from '@/lib/medications/catalog'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'
import { TimeInput } from '@/components/ui/Form'

const MAX_MEDS = 5
const INITIAL_MEDS = 2
const EXTRA_MEDS = 2

type MedRow = { query: string; selected: MedicationRecommendation | null }

function emptyRows(count: number): MedRow[] {
  return Array.from({ length: count }, () => ({ query: '', selected: null }))
}

export function HomeDrugSearch() {
  const [rows, setRows] = useState<MedRow[]>(() => emptyRows(INITIAL_MEDS))
  const [extraOpen, setExtraOpen] = useState(false)
  const [activeAc, setActiveAc] = useState<number | null>(null)
  const [wakeTime, setWakeTime] = useState('07:30')
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const activeMeds = rows.filter((r) => r.selected)
  const visibleCount = extraOpen ? rows.length : INITIAL_MEDS

  function updateRow(i: number, patch: Partial<MedRow>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  function handleQueryChange(i: number, value: string) {
    updateRow(i, {
      query: value,
      selected: value === rows[i].selected?.displayName ? rows[i].selected : null,
    })
  }

  function handlePick(i: number, med: MedicationRecommendation) {
    updateRow(i, { query: med.displayName, selected: med })
    setActiveAc(null)
  }

  function clearRow(i: number) {
    updateRow(i, { query: '', selected: null })
    inputRefs.current[i]?.focus()
  }

  function openExtraMeds() {
    setExtraOpen(true)
    setRows((prev) => {
      const target = INITIAL_MEDS + EXTRA_MEDS
      if (prev.length >= target) return prev
      return [...prev, ...emptyRows(target - prev.length)]
    })
  }

  function addFifthMed() {
    if (rows.length < MAX_MEDS) {
      setRows((prev) => [...prev, { query: '', selected: null }])
    }
  }

  function getResults(i: number) {
    const q = rows[i].query.trim()
    if (!q || rows[i].selected) return []
    return searchMedicationCatalog(q, { limit: 8 }).map((entry) =>
      buildMedicationRecommendation(entry, 0)
    )
  }

  const checkHref = useMemo(() => {
    const medCodes = activeMeds.map((r) => r.selected!.code)
    return buildPatientLandingPath({ medCodes, wake: wakeTime })
  }, [activeMeds, wakeTime])

  const canCheck = activeMeds.length >= 1

  function renderSearchRow(row: MedRow, i: number) {
    const results = getResults(i)
    const showDropdown = activeAc === i && row.query.trim().length > 0 && !row.selected
    const placeholder = `Med ${i + 1}`

    return (
      <div
        key={i}
        className={`med-search med-search--hero ${row.selected ? 'med-search--selected' : ''}`}
      >
        <div className="med-search__bar">
          <input
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            id={i === 0 ? 'home-med-search' : undefined}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder}
            aria-label={placeholder}
            value={row.query}
            onChange={(e) => handleQueryChange(i, e.target.value)}
            onFocus={() => setActiveAc(i)}
            onBlur={() => setTimeout(() => setActiveAc((ac) => (ac === i ? null : ac)), 160)}
            className="med-search__input"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? `home-med-search-results-${i}` : undefined}
            aria-autocomplete="list"
          />
          {row.query && (
            <button
              type="button"
              className="home-drug-search__clear"
              onClick={() => clearRow(i)}
              aria-label="Clear"
            >
              ×
            </button>
          )}
        </div>

        {showDropdown && (
          <ul
            id={`home-med-search-results-${i}`}
            className="med-search__dropdown"
            role="listbox"
            aria-label="Medication suggestions"
          >
            {results.length === 0 ? (
              <li className="med-search__empty" role="presentation">
                No matches
              </li>
            ) : (
              results.map((med) => (
                <li key={med.code} role="option">
                  <button
                    type="button"
                    className="med-search__option"
                    onMouseDown={() => handlePick(i, med)}
                  >
                    <span className="med-search__option-name">{med.displayName}</span>
                    <span className="med-search__option-meta">
                      {med.timingTier === 'optimised' && med.recommendedStart && med.recommendedEnd
                        ? `${med.recommendedStart}–${med.recommendedEnd}`
                        : med.drugClass}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="home-drug-search home-drug-search--poly">
      <div className="home-drug-search__med-grid">
        {rows.slice(0, visibleCount).map((row, i) => renderSearchRow(row, i))}
      </div>

      {!extraOpen ? (
        <button
          type="button"
          className="home-drug-search__foot-link home-drug-search__expand bg-transparent border-none cursor-pointer text-left p-0"
          onClick={openExtraMeds}
        >
          + add other medications
        </button>
      ) : (
        rows.length < MAX_MEDS && (
          <button
            type="button"
            className="home-drug-search__foot-link home-drug-search__expand bg-transparent border-none cursor-pointer text-left p-0"
            onClick={addFifthMed}
          >
            + add another medication
          </button>
        )
      )}

      <div className="home-drug-search__preview">
        <label className="home-drug-search__time-row home-drug-search__time-row--lead">
          <span>Usual wake time</span>
          <TimeInput
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="home-drug-search__time-input"
            required
          />
        </label>

        {canCheck ? (
          <Link
            href={checkHref}
            className="seco-landing__btn seco-landing__btn--primary home-drug-search__cta"
          >
            Check my risk →
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="seco-landing__btn seco-landing__btn--primary home-drug-search__cta opacity-50 cursor-not-allowed"
          >
            Check my risk →
          </button>
        )}

        <details className="mt-4">
          <summary className="home-drug-search__foot-link cursor-pointer list-none">
            why does this matter?
          </summary>
          <div className="home-drug-search__detail mt-3 space-y-3">
            <p>
              Most medications have a circadian window — a time of day when they work best and carry
              lowest risk. When you take multiple drugs, those windows can conflict.
            </p>
            <p>
              Your GP prescribes each medication individually. Nobody checks the timing interactions
              across your full combination — until now.
            </p>
            <p>
              Deepdose maps your polypharmacy profile against circadian evidence from the Hygia
              Trial (19,084 patients) and the TIME substudy to show you where your risk sits.
            </p>
          </div>
        </details>
      </div>
    </div>
  )
}
