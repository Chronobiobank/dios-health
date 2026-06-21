'use client'

import { useState } from 'react'
import { CHI_ABBREV } from '@/lib/circadian/chi'
import { Button } from '@/components/ui/Button'

type FilterOptions = {
  ageBands: string[]
  biologicalSex: string[]
  chronotypeCats: string[]
  medicationCodes: string[]
}

type CohortAggregates = {
  totalRecords: number
  uniqueCohorts: number
  meanCircadianScore?: number | null
  meanSjlHours?: number | null
  meanTimingShiftMinutes?: number | null
  outcomesRecorded?: number
}

type QueryResponse = {
  suppressed: boolean
  minCohortSize: number
  aggregates: CohortAggregates
  queryHash: string
  error?: string
}

const FACETS = [
  { key: 'ageBands', label: 'Age band' },
  { key: 'biologicalSex', label: 'Sex' },
  { key: 'chronotypeCats', label: 'Chronotype' },
  { key: 'medicationCodes', label: 'Medication' },
] as const

type FacetKey = (typeof FACETS)[number]['key']

export function CohortBuilder({ options }: { options: FilterOptions }) {
  const [selected, setSelected] = useState<Record<FacetKey, string[]>>({
    ageBands: [],
    biologicalSex: [],
    chronotypeCats: [],
    medicationCodes: [],
  })
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function toggle(facet: FacetKey, value: string) {
    setSelected((prev) => {
      const has = prev[facet].includes(value)
      return {
        ...prev,
        [facet]: has ? prev[facet].filter((v) => v !== value) : [...prev[facet], value],
      }
    })
  }

  async function runQuery() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chronobiobank/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selected),
      })
      const data: QueryResponse = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Query failed.')
        setResult(null)
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  const facetValues: Record<FacetKey, string[]> = {
    ageBands: options.ageBands,
    biologicalSex: options.biologicalSex,
    chronotypeCats: options.chronotypeCats,
    medicationCodes: options.medicationCodes,
  }

  return (
    <div className="space-y-6">
      <section className="seco-app-card" aria-label="Cohort filters">
        <h2 className="seco-app-card__title">Build a cohort</h2>
        <p className="mb-5 text-sm text-ink-faint">
          Select facets to scope the cohort. Results are aggregate counts only — never individual
          records. Cohorts under the minimum size are suppressed.
        </p>
        <div className="cbb-facets">
          {FACETS.map((facet) => {
            const values = facetValues[facet.key]
            if (values.length === 0) return null
            return (
              <fieldset key={facet.key} className="cbb-facet">
                <legend className="cbb-facet__legend">{facet.label}</legend>
                <div className="cbb-facet__chips">
                  {values.map((value) => {
                    const active = selected[facet.key].includes(value)
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`cbb-chip${active ? ' cbb-chip--active' : ''}`}
                        aria-pressed={active}
                        onClick={() => toggle(facet.key, value)}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            )
          })}
        </div>
        <Button type="button" className="mt-5" onClick={runQuery} disabled={loading}>
          {loading ? 'Running…' : 'Run cohort query'}
        </Button>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </section>

      {result && (
        <section className="seco-app-card" aria-label="Cohort result">
          <h2 className="seco-app-card__title">Cohort result</h2>
          {result.suppressed ? (
            <p className="text-sm text-amber-300">
              Cohort of {result.aggregates.totalRecords} is below the minimum size of{' '}
              {result.minCohortSize}. Counts suppressed to protect re-identification — broaden your
              filters.
            </p>
          ) : (
            <div className="cbb-stat-grid">
              <Stat label="Records" value={result.aggregates.totalRecords} />
              <Stat label="Unique participants" value={result.aggregates.uniqueCohorts} />
              <Stat
                label={`Mean ${CHI_ABBREV}`}
                value={fmt(result.aggregates.meanCircadianScore)}
              />
              <Stat label="Mean social jet lag" value={fmtUnit(result.aggregates.meanSjlHours, 'h')} />
              <Stat
                label="Mean timing shift"
                value={fmtUnit(result.aggregates.meanTimingShiftMinutes, 'min')}
              />
              <Stat label="Outcomes recorded" value={result.aggregates.outcomesRecorded ?? 0} />
            </div>
          )}
          <p className="mt-4 text-xs text-ink-faint">Query logged · ref {result.queryHash}</p>
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="cbb-stat">
      <span className="cbb-stat__value">{value}</span>
      <span className="cbb-stat__label">{label}</span>
    </div>
  )
}

function fmt(value: number | null | undefined): string {
  return value == null ? '—' : String(value)
}

function fmtUnit(value: number | null | undefined, unit: string): string {
  return value == null ? '—' : `${value} ${unit}`
}
