'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  buildMedicationRecommendation,
  searchMedicationCatalog,
  type MedicationRecommendation,
} from '@/lib/medications/catalog'
import { buildPatientLandingPath } from '@/lib/medications/home-to-onboarding'
import { isTimeInWindow } from '@/lib/utils/time'
import { TimeInput } from '@/components/ui/Form'

interface TimingVerdict {
  kind: 'optimised' | 'tracked'
  inWindow: boolean | null
  headline: string
  detail: string
}

function buildVerdict(med: MedicationRecommendation, userTime: string): TimingVerdict {
  if (med.timingTier !== 'optimised' || !med.recommendedStart || !med.recommendedEnd) {
    return {
      kind: 'tracked',
      inWindow: null,
      headline: 'Timing research coming soon',
      detail:
        'We can track this medicine at your current time. Sign up to save it and get reminders.',
    }
  }

  const inWindow = isTimeInWindow(userTime, med.recommendedStart, med.recommendedEnd)

  if (inWindow) {
    return {
      kind: 'optimised',
      inWindow: true,
      headline: 'Your time looks good',
      detail: `${userTime.slice(0, 5)} fits the ${med.recommendedStart}–${med.recommendedEnd} window.`,
    }
  }

  return {
    kind: 'optimised',
    inWindow: false,
    headline: 'You may be off-window',
    detail: `${med.recommendedStart}–${med.recommendedEnd} works better than ${userTime.slice(0, 5)} for most people.`,
  }
}

export function HomeDrugSearch() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<MedicationRecommendation | null>(null)
  const [userTime, setUserTime] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchMedicationCatalog(query, { limit: 8 }).map((entry) =>
      buildMedicationRecommendation(entry, 0)
    )
  }, [query])

  const showDropdown = query.trim().length > 0 && !selected
  const hasTime = userTime.length >= 4
  const verdict = selected && hasTime ? buildVerdict(selected, userTime) : null

  const landingHref = selected
    ? buildPatientLandingPath({ med: selected.code, time: userTime })
    : buildPatientLandingPath()

  function handlePick(med: MedicationRecommendation) {
    setSelected(med)
    setQuery(med.displayName)
    setUserTime('')
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (selected && value !== selected.displayName) {
      setSelected(null)
    }
  }

  function clearSelection() {
    setSelected(null)
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="home-drug-search">
      <div className={`med-search med-search--hero ${selected ? 'med-search--selected' : ''}`}>
        <div className="med-search__bar">
          <span className="med-search__icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={inputRef}
            id="home-med-search"
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="What are you taking right now?"
            aria-label="What are you taking right now?"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="med-search__input"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="home-med-search-results"
            aria-autocomplete="list"
          />
          {selected && (
            <button
              type="button"
              className="home-drug-search__clear"
              onClick={clearSelection}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {showDropdown && (
          <ul
            id="home-med-search-results"
            className="med-search__dropdown"
            role="listbox"
            aria-label="Medication suggestions"
          >
            {results.length === 0 ? (
              <li className="med-search__empty" role="presentation">
                No matches for &ldquo;{query.trim()}&rdquo;
              </li>
            ) : (
              results.map((med) => (
                <li key={med.code} role="option">
                  <button type="button" onClick={() => handlePick(med)} className="med-search__option">
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

      {selected && (
        <div
          className={`home-drug-search__preview ${
            verdict?.inWindow === true
              ? 'home-drug-search__preview--ok'
              : verdict?.inWindow === false
                ? 'home-drug-search__preview--warn'
                : ''
          }`}
        >
          <label className="home-drug-search__time-row home-drug-search__time-row--lead">
            <span>When do you take it?</span>
            <TimeInput
              value={userTime}
              onChange={(e) => setUserTime(e.target.value)}
              className="home-drug-search__time-input"
              required
            />
          </label>

          {verdict && (
            <div className="home-drug-search__diagnosis">
              <p
                className={`home-drug-search__verdict ${
                  verdict.inWindow === false ? 'home-drug-search__verdict--headline' : ''
                }`}
              >
                {verdict.headline}
              </p>
              <p className="home-drug-search__detail">{verdict.detail}</p>
            </div>
          )}

          {hasTime && (
            <Link
              href={landingHref}
              className="seco-landing__btn seco-landing__btn--primary home-drug-search__cta"
            >
              Get your free precision dosing plan
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
