'use client'

import { useMemo, useRef, useState } from 'react'
import type { MedicationRecommendation } from '@/lib/medications/catalog'
import {
  buildMedicationRecommendation,
  searchMedicationCatalog,
} from '@/lib/medications/catalog'

interface MedicationSearchPanelProps {
  phaseOffsetMinutes: number
  selectedCodes: Set<string>
  onSelect: (medication: MedicationRecommendation) => void
  placeholder?: string
}

export default function MedicationSearchPanel({
  phaseOffsetMinutes,
  selectedCodes,
  onSelect,
  placeholder = 'Search meds & supps',
}: MedicationSearchPanelProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchMedicationCatalog(query, { limit: 8 }).map((entry) =>
      buildMedicationRecommendation(entry, phaseOffsetMinutes)
    )
  }, [query, phaseOffsetMinutes])

  const showDropdown = query.trim().length > 0

  function handleSelect(med: MedicationRecommendation) {
    if (selectedCodes.has(med.code)) return
    onSelect(med)
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="med-search">
      <div className="med-search__bar">
        <span className="med-search__icon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id="med-search"
          type="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="med-search__input"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="med-search-results"
          aria-autocomplete="list"
        />
      </div>

      {showDropdown && (
        <ul
          id="med-search-results"
          className="med-search__dropdown"
          role="listbox"
          aria-label="Medication suggestions"
        >
          {results.length === 0 ? (
            <li className="med-search__empty" role="presentation">
              No matches for &ldquo;{query.trim()}&rdquo;
            </li>
          ) : (
            results.map((med) => {
              const alreadyAdded = selectedCodes.has(med.code)
              return (
                <li key={med.code} role="option" aria-selected={alreadyAdded}>
                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleSelect(med)}
                    className="med-search__option"
                  >
                    <span className="med-search__option-name">{med.displayName}</span>
                    <span className="med-search__option-meta">
                      {alreadyAdded ? 'Added' : med.drugClass}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
