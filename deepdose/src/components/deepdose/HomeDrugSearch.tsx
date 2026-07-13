'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  buildMedicationRecommendation,
  searchMedicationCatalog,
  type MedicationRecommendation,
} from '@/lib/medications/catalog'
import {
  buildHomeChemistryPath,
  buildPatientLandingPath,
  earliestTakeTime,
} from '@/lib/medications/home-to-onboarding'

import {
  DEEPDOSE_HOME_DEFAULT_MED_CODES,
  DEEPDOSE_HOME_POLY_SEARCH,
} from '@/lib/deepdose-marketing/landing-content'
import { resolveHomePlanRows } from '@/lib/patient/home-plan-rows'
import { savePlanDraft } from '@/lib/patient/plan-draft'
import { TimeInput } from '@/components/ui/Form'

/** Start with two meds; users can add more via expand link. */
const HOME_MED_ROWS = 2
const HOME_MED_ROWS_MAX = 8
const DEFAULT_TAKE_TIMES = ['07:30', '08:00'] as const
const DEFAULT_WAKE = '07:30'
const DEFAULT_SLEEP = '23:30'

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

type HomeDrugSearchProps = {
  /** Hide the standalone CTA (auth form owns submit). */
  showCta?: boolean
  /** Where the CTA navigates when shown. */
  destination?: 'connect' | 'profile'
  /** Fires whenever resolved med codes/times change. */
  onPlanChange?: (plan: {
    medCodes: string[]
    medTimes: string[]
    wake: string | null
  }) => void
}

export function HomeDrugSearch({
  showCta = true,
  destination = 'connect',
  onPlanChange,
}: HomeDrugSearchProps = {}) {
  const [rows, setRows] = useState<MedRow[]>(() => emptyRows(HOME_MED_ROWS))
  const [wakeTime, setWakeTime] = useState(DEFAULT_WAKE)
  const [sleepTime, setSleepTime] = useState(DEFAULT_SLEEP)
  const [activeAc, setActiveAc] = useState<number | null>(null)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const resolvedPlan = useMemo(
    () =>
      resolveHomePlanRows(
        rows.map((row) => ({
          selectedCode: row.selected?.code ?? null,
          takeTime: row.takeTime,
        })),
        rows.length,
        DEEPDOSE_HOME_DEFAULT_MED_CODES
      ),
    [rows]
  )

  function addMedRow() {
    if (rows.length >= HOME_MED_ROWS_MAX) return
    const nextIndex = rows.length
    setRows((prev) => [
      ...prev,
      {
        query: '',
        selected: null,
        takeTime: DEFAULT_TAKE_TIMES[nextIndex] ?? '08:00',
      },
    ])
    requestAnimationFrame(() => {
      inputRefs.current[nextIndex]?.focus()
    })
  }

  const planSnapshot = useMemo(() => {
    const { medCodes, medTimes } = resolvedPlan
    return {
      medCodes,
      medTimes,
      wake: wakeTime || earliestTakeTime(medTimes),
    }
  }, [resolvedPlan, wakeTime])

  useEffect(() => {
    onPlanChange?.(planSnapshot)
  }, [onPlanChange, planSnapshot])

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

  function getResults(index: number) {
    const query = rows[index].query.trim()
    if (!query || rows[index].selected) return []
    return searchMedicationCatalog(query, { limit: 8 }).map((entry) =>
      buildMedicationRecommendation(entry, 0)
    )
  }

  const checkHref = useMemo(() => {
    const { medCodes, medTimes, wake } = planSnapshot
    return destination === 'profile'
      ? buildPatientLandingPath({ medCodes, medTimes, wake: wake ?? undefined })
      : buildHomeChemistryPath({ medCodes, medTimes, wake: wake ?? undefined })
  }, [destination, planSnapshot])

  const canCheck = resolvedPlan.medCodes.length >= 1

  function handleFixTiming() {
    savePlanDraft(planSnapshot)
  }

  function renderAnchorRow(
    label: 'When you wake' | 'When you sleep',
    value: string,
    onChange: (next: string) => void
  ) {
    return (
      <div className="med-search med-search--hero home-drug-search__row home-drug-search__anchor">
        <div className="med-search__bar home-drug-search__bar">
          <span className="home-drug-search__anchor-name">{label}</span>
          <div className="home-drug-search__take">
            <TimeInput
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="home-drug-search__take-input"
              aria-label={label}
            />
          </div>
        </div>
      </div>
    )
  }

  function renderSearchRow(row: MedRow, index: number) {
    const results = getResults(index)
    const showDropdown = activeAc === index && row.query.trim().length > 0 && !row.selected
    const placeholder = medPlaceholder(index)

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
            aria-label={placeholder}
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
            <TimeInput
              value={row.takeTime}
              onChange={(event) => updateRow(index, { takeTime: event.target.value })}
              className="home-drug-search__take-input"
              aria-label={`Time for ${placeholder}`}
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
                <li key={med.code} role="option" aria-selected={false}>
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

  const canAddMed = rows.length < HOME_MED_ROWS_MAX

  return (
    <div className="home-drug-search home-drug-search--poly">
      <div className="home-drug-search__med-stack">
        {renderAnchorRow('When you wake', wakeTime, setWakeTime)}
        {renderAnchorRow('When you sleep', sleepTime, setSleepTime)}
        {rows.map((row, index) => renderSearchRow(row, index))}
      </div>

      {canAddMed ? (
        <div className="home-drug-search__expand-row">
          <button
            type="button"
            className="home-drug-search__expand-link"
            onClick={addMedRow}
          >
            {rows.length > HOME_MED_ROWS
              ? DEEPDOSE_HOME_POLY_SEARCH.expandCtaAnother
              : DEEPDOSE_HOME_POLY_SEARCH.expandCta}
          </button>
        </div>
      ) : null}

      {showCta ? (
        <div className="home-drug-search__join">
          {canCheck ? (
            <Link
              href={checkHref}
              onClick={handleFixTiming}
              className="dd-gate__signup home-drug-search__join-btn"
            >
              {DEEPDOSE_HOME_POLY_SEARCH.checkCta}
            </Link>
          ) : (
            <button type="button" disabled className="dd-gate__signup home-drug-search__join-btn">
              {DEEPDOSE_HOME_POLY_SEARCH.checkCta}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
