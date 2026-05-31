'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SECTION_LABEL } from '@/components/dashboard/dashboard-styles'
import { formatDbTime, formatReportDate, type TipTraqNightRow } from '@/lib/dashboard/dlmo-profile'

type TipTraqNightListProps = {
  nights: TipTraqNightRow[]
  title?: string
}

export function TipTraqNightList({ nights, title = 'Uploaded recordings' }: TipTraqNightListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (nights.length === 0) {
    return null
  }

  async function deleteNight(id: string, reportDate: string) {
    const label = formatReportDate(reportDate)
    if (!window.confirm(`Delete the ${label} recording? This cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/tiptraq/nights/${id}`, { method: 'DELETE' })
      const payload = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(payload.error || 'Could not delete recording')
      }

      router.refresh()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete recording')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <h2 className={SECTION_LABEL}>{title}</h2>

      <ul className="mt-4 space-y-3">
        {nights.map((night) => (
          <li
            key={night.id}
            className="flex items-center justify-between gap-3 rounded-xl border-[0.5px] border-black/[0.08] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-black">{formatReportDate(night.report_date)}</p>
              <p className="mt-0.5 font-mono text-[11px] text-black/45">
                DLMO {formatDbTime(night.proxy_dlmo_time)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="text-right">
                <p className="font-mono text-sm font-medium text-black">{night.confidence_score ?? '—'}%</p>
                <p className="font-mono text-[11px] text-black/45">{night.confidence_label ?? 'Low'}</p>
              </div>
              <button
                type="button"
                disabled={deletingId === night.id}
                onClick={() => void deleteNight(night.id, night.report_date)}
                className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                {deletingId === night.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
