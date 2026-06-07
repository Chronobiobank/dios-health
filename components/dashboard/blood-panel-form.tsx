'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent } from 'react'

import { BTN_PRIMARY, CARD, LABEL } from '@/components/sections/layout'
import { AUTH_INPUT_CLASS } from '@/lib/auth/form-styles'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import {
  GOMINAK_STATUS_CLASS,
  GOMINAK_TARGETS,
  getGominakRangeStatus,
  gominakStatusLabel,
  mapLabSourceToDb,
  type GominakRangeStatus,
} from '@/lib/dashboard/blood-panel-gominak'
import { BLOOD_PANEL_CADENCE } from '@/lib/product/intelligence-cadence'
import { cn } from '@/lib/utils'

const LAB_SOURCES = ['City Labs', 'GP', 'Awanui', 'Other'] as const

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function RangeIndicator({ status }: { status: GominakRangeStatus }) {
  if (status === 'missing') return null

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        GOMINAK_STATUS_CLASS[status]
      )}
    >
      {gominakStatusLabel(status)}
    </span>
  )
}

type BloodFieldProps = {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  status: GominakRangeStatus
  required?: boolean
  optional?: boolean
  disabled?: boolean
}

function BloodField({
  id,
  label,
  hint,
  value,
  onChange,
  status,
  required = true,
  optional = false,
  disabled = false,
}: BloodFieldProps) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className={LABEL}>
          {label}
          {optional ? <span className="text-black/40"> (optional)</span> : null}
        </label>
        <RangeIndicator status={status} />
      </div>
      <input
        id={id}
        name={id}
        type="number"
        step="any"
        min={0}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={AUTH_INPUT_CLASS}
        disabled={disabled}
      />
      {hint ? <p className="mt-2 text-sm text-black/50">{hint}</p> : null}
    </div>
  )
}

export function BloodPanelForm() {
  const [collectionDate, setCollectionDate] = useState(todayIsoDate)
  const [labSource, setLabSource] = useState<(typeof LAB_SOURCES)[number]>('City Labs')
  const [vitaminD3, setVitaminD3] = useState('')
  const [vitaminB12, setVitaminB12] = useState('')
  const [ferritin, setFerritin] = useState('')
  const [pth, setPth] = useState('')
  const [serumCalcium, setSerumCalcium] = useState('')
  const [vitaminB5, setVitaminB5] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const d3Value = parseOptionalNumber(vitaminD3)
  const b12Value = parseOptionalNumber(vitaminB12)
  const ferritinValue = parseOptionalNumber(ferritin)

  const d3Status = useMemo(
    () => getGominakRangeStatus(d3Value, GOMINAK_TARGETS.vitaminD3.min, GOMINAK_TARGETS.vitaminD3.max),
    [d3Value]
  )
  const b12Status = useMemo(
    () => getGominakRangeStatus(b12Value, GOMINAK_TARGETS.vitaminB12.min, GOMINAK_TARGETS.vitaminB12.max),
    [b12Value]
  )
  const ferritinStatus = useMemo(
    () => getGominakRangeStatus(ferritinValue, GOMINAK_TARGETS.ferritin.min, GOMINAK_TARGETS.ferritin.max),
    [ferritinValue]
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const d3 = parseOptionalNumber(vitaminD3)
    const b12 = parseOptionalNumber(vitaminB12)
    const ferr = parseOptionalNumber(ferritin)
    const pthValue = parseOptionalNumber(pth)
    const calciumValue = parseOptionalNumber(serumCalcium)
    const b5 = parseOptionalNumber(vitaminB5)

    if (d3 == null || b12 == null || ferr == null || pthValue == null || calciumValue == null) {
      setError('25-OH Vitamin D, B12, ferritin, PTH, and serum calcium are required.')
      setLoading(false)
      return
    }

    try {
      const collectedAt = `${collectionDate}T12:00:00.000Z`
      const response = await fetch('/api/blood/panels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collected_at: collectedAt,
          lab_source: mapLabSourceToDb(labSource),
          vitamin_d3_nmoll: d3,
          vitamin_b12_pmoll: b12,
          ferritin_ugl: ferr,
          vitamin_b5_umoll: b5,
          raw_results: {
            pth_pg_ml: pthValue,
            serum_calcium_mmol_l: calciumValue,
            panel_cadence_days: BLOOD_PANEL_CADENCE.intervalDays,
          },
        }),
      })

      const result = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(result.error ?? 'Could not save blood results. Please try again.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Could not save blood results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={`${CARD} mt-8 rounded-2xl p-6`}>
        <p className="type-body text-black/80">
          90-day panel saved. Biological response markers update your clinician review window.
        </p>
        <Link
          href={PATIENT_ROUTES.dashboard}
          className={`${BTN_PRIMARY} mt-6 inline-flex h-11 px-6`}
        >
          Back to dashboard →
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`${CARD} mt-8 space-y-5 rounded-2xl p-6`}>
      <p className="text-sm text-black/60">
        90-day Coimbra safety panel — PTH, 25-OH Vitamin D, B12, ferritin, serum calcium. Next draw
        due in {BLOOD_PANEL_CADENCE.intervalDays} days after collection.
      </p>
      <div>
        <label htmlFor="collection_date" className={`${LABEL} mb-2 block`}>
          Collection date
        </label>
        <input
          id="collection_date"
          name="collection_date"
          type="date"
          required
          value={collectionDate}
          onChange={(event) => setCollectionDate(event.target.value)}
          className={AUTH_INPUT_CLASS}
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="lab_source" className={`${LABEL} mb-2 block`}>
          Lab source
        </label>
        <select
          id="lab_source"
          name="lab_source"
          required
          value={labSource}
          onChange={(event) => setLabSource(event.target.value as (typeof LAB_SOURCES)[number])}
          className={AUTH_INPUT_CLASS}
          disabled={loading}
        >
          {LAB_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      <BloodField
        id="vitamin_d3"
        label="25-OH Vitamin D (nmol/L)"
        hint="Target range 150–200 nmol/L (Gominak protocol)"
        value={vitaminD3}
        onChange={setVitaminD3}
        status={d3Status}
        disabled={loading}
      />

      <BloodField
        id="vitamin_b12"
        label="Vitamin B12 (pmol/L)"
        value={vitaminB12}
        onChange={setVitaminB12}
        status={b12Status}
        disabled={loading}
      />

      <BloodField
        id="ferritin"
        label="Ferritin (μg/L)"
        value={ferritin}
        onChange={setFerritin}
        status={ferritinStatus}
        disabled={loading}
      />

      <BloodField
        id="pth"
        label="PTH (pg/mL)"
        hint="Coimbra target — suppressed below 20 pg/mL when protocol is working"
        value={pth}
        onChange={setPth}
        status="missing"
        disabled={loading}
      />

      <BloodField
        id="serum_calcium"
        label="Serum calcium (mmol/L)"
        hint="Safety gate — contact clinician if above reference range"
        value={serumCalcium}
        onChange={setSerumCalcium}
        status="missing"
        disabled={loading}
      />

      <BloodField
        id="vitamin_b5"
        label="Vitamin B5 (μmol/L)"
        hint="Optional — not always included"
        value={vitaminB5}
        onChange={setVitaminB5}
        status="missing"
        required={false}
        optional
        disabled={loading}
      />

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className={`${BTN_PRIMARY} h-12 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8`}
      >
        {loading ? 'Saving…' : 'Save blood results →'}
      </button>
    </form>
  )
}
