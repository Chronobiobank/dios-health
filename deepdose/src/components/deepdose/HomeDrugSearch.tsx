'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  buildMedicationRecommendation,
  searchMedicationCatalog,
  type MedicationRecommendation,
} from '@/lib/medications/catalog'
import { buildPatientLandingPath, earliestTakeTime } from '@/lib/medications/home-to-onboarding'
import {
  DEEPDOSE_HOME_DEFAULT_MED_CODES,
  DEEPDOSE_HOME_POLY_SEARCH,
} from '@/lib/deepdose-marketing/landing-content'
import { resolveHomePlanRows } from '@/lib/patient/home-plan-rows'
import { savePlanDraft } from '@/lib/patient/plan-draft'
import { TimeInput } from '@/components/ui/Form'

const MAX_MEDS = 5
const INITIAL_MEDS = 4
const DEFAULT_TAKE_TIMES = ['07:30', '08:00', '20:00', '12:00', '22:00'] as const

function medPlaceholder(index: number): string {
  return (
    DEEPDOSE_HOME_POLY_SEARCH.medPlaceholders[index] ??
    DEEPDOSE_HOME_POLY_SEARCH.medPlaceholderExtra
  )
}

type MedRow = {
  query: string
  selected: MedicationRecommendation | null
  takeTime: string
}

function emptyRows(count: number): MedRow[] {
  return Array.from({ length: count }, (_, index) => ({
    query: '',
    selected: null,
    takeTime: DEFAULT_TAKE_TIMES[index] ?? '08:00',
  }))
}

export function HomeDrugSearch() {
  const [rows, setRows] = useState<MedRow[]>(() => emptyRows(INITIAL_MEDS))
  const [extraOpen, setExtraOpen] = useState(false)
  const [activeAc, setActiveAc] = useState<number | null>(null)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const visibleCount = extraOpen ? rows.length : INITIAL_MEDS

  const resolvedPlan = useMemo(
    () =>
      resolveHomePlanRows(
        rows.map((row) => ({
          selectedCode: row.selected?.code ?? null,
          takeTime: row.takeTime,
        })),
        visibleCount,
        DEEPDOSE_HOME_DEFAULT_MED_CODES
      ),
    [rows, visibleCount]
  )

  function updateRow(index: number, patch: Partial<MedRow>) {
    setRows((prev) => prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row)))
  }

  function handleQueryChange(index: number, value: string) {
    updateRow(index, {
      query: value,
      selected: value === rows[index].selected?.displayName ? rows[index].selected : null,
    })
  }

  function handlePick(index: number, med: MedicationRecommendation) {
    const defaultTime =
      med.recommendedStart ??
      rows[index]?.takeTime ??
      DEFAULT_TAKE_TIMES[index] ??
      '08:00'
    updateRow(index, { query: med.displayName, selected: med, takeTime: defaultTime })
    setActiveAc(null)
  }

  function clearRow(index: number) {
    updateRow(index, { query: '', selected: null })
    inputRefs.current[index]?.focus()
  }

  function openExtraMeds() {
    setExtraOpen(true)
    if (rows.length < MAX_MEDS) {
      setRows((prev) => [
        ...prev,
        {
          query: '',
          selected: null,
          takeTime: DEFAULT_TAKE_TIMES[prev.length] ?? '08:00',
        },
      ])
    }
  }

  function addFifthMed() {
    if (rows.length < MAX_MEDS) {
      setRows((prev) => [
        ...prev,
        { query: '', selected: null, takeTime: DEFAULT_TAKE_TIMES[prev.length] ?? '08:00' },
      ])
    }
  }

  function getResults(index: number) {
    const query = rows[index].query.trim()
    if (!query || rows[index].selected) return []
    return searchMedicationCatalog(query, { limit: 8 }).map((entry) =>
      buildMedicationRecommendation(entry, 0)
    )
  }

  const checkHref = useMemo(() => {
    const { medCodes, medTimes } = resolvedPlan
    const wake = earliestTakeTime(medTimes) ?? undefined
    return buildPatientLandingPath({ medCodes, medTimes, wake })
  }, [resolvedPlan])

  const canCheck = resolvedPlan.medCodes.length >= 1

  function handleFixTiming() {
    const { medCodes, medTimes } = resolvedPlan
    savePlanDraft({
      medCodes,
      medTimes,
      wake: earliestTakeTime(medTimes),
    })
  }

  function renderSearchRow(row: MedRow, index: number) {
    const results = getResults(index)
    const showDropdown = activeAc === index && row.query.trim().length > 0 && !row.selected
    const placeholder = medPlaceholder(index)
    const ariaLabel = placeholder

    return (
      <div
        key={index}
        className={`med-search med-search--hero home-drug-search__row ${row.selected ? 'med-search--selected' : ''}`}
      >
        <div className="med-search__bar home-drug-search__bar">
          <span className="med-search__icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={(element) => {
              inputRefs.current[index] = element
            }}
            id={index === 0 ? 'home-med-search' : undefined}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder={placeholder}
            aria-label={ariaLabel}
            value={row.query}
            onChange={(event) => handleQueryChange(index, event.target.value)}
            onFocus={() => setActiveAc(index)}
            onBlur={() =>
              setTimeout(() => setActiveAc((active) => (active === index ? null : active)), 160)
            }
            className="med-search__input"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={showDropdown ? `home-med-search-results-${index}` : undefined}
            aria-autocomplete="list"
          />
          {row.query ? (
            <button
              type="button"
              className="home-drug-search__clear"
              onClick={() => clearRow(index)}
              aria-label="Clear"
            >
              ×
            </button>
          ) : null}
          <div className="home-drug-search__take">
            <span className="home-drug-search__take-label">Take</span>
            <TimeInput
              value={row.takeTime}
              onChange={(event) => updateRow(index, { takeTime: event.target.value })}
              className="home-drug-search__take-input"
              aria-label={`Take time for ${placeholder}`}
            />
          </div>
        </div>

        {showDropdown ? (
          <ul
            id={`home-med-search-results-${index}`}
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
                    onMouseDown={() => handlePick(index, med)}
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
        ) : null}
      </div>
    )
  }

  return (
    <div className="home-drug-search home-drug-search--poly">
      <div className="home-drug-search__med-stack">
        {rows.slice(0, visibleCount).map((row, index) => renderSearchRow(row, index))}
      </div>

      <div className="home-drug-search__expand-row">
        {!extraOpen ? (
          <button type="button" className="home-drug-search__expand-link" onClick={openExtraMeds}>
            {DEEPDOSE_HOME_POLY_SEARCH.expandCta}
          </button>
        ) : (
          rows.length < MAX_MEDS && (
            <button type="button" className="home-drug-search__expand-link" onClick={addFifthMed}>
              {DEEPDOSE_HOME_POLY_SEARCH.expandCtaAnother}
            </button>
          )
        )}
      </div>

      <div className="home-drug-search__toolbar home-drug-search__toolbar--cta">
        <div className="home-drug-search__toolbar-end">
          {canCheck ? (
            <Link
              href={checkHref}
              onClick={handleFixTiming}
              className="seco-landing__btn seco-landing__btn--primary home-drug-search__cta home-drug-search__toolbar-btn"
            >
              {DEEPDOSE_HOME_POLY_SEARCH.checkCta}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="seco-landing__btn seco-landing__btn--primary home-drug-search__cta home-drug-search__toolbar-btn"
            >
              {DEEPDOSE_HOME_POLY_SEARCH.checkCta}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
