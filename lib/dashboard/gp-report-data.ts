import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { formatDbTime, formatReportDate, resolveChronotypeLabel } from '@/lib/dashboard/dlmo-profile'

export type GpReportNight = {
  report_date: string
  proxy_dlmo_time: string | null
  confidence_score: number | null
}

export type GpReportData = {
  patientName: string
  age: number | null
  biologicalSex: string | null
  generatedAt: string
  hasTipTraqData: boolean
  nightsCount: number
  dlmoTime: string
  confidenceScore: number | null
  confidenceLabel: string | null
  confidenceBandMinutes: number | null
  chronotype: string | null
  doseWindows: Array<{ label: string; time: string }>
  nights: GpReportNight[]
  dataShareGpEnabled: boolean
}

function formatBiologicalSex(value: string | null): string | null {
  if (!value) return null
  const labels: Record<string, string> = {
    female: 'Female',
    male: 'Male',
    intersex: 'Intersex',
    prefer_not_to_say: 'Prefer not to say',
  }
  return labels[value] ?? value
}

export function buildGpReportData(input: {
  patientName: string
  age: number | null
  biologicalSex: string | null
  dataShareGp: boolean
  dlmoProfile: DlmoProfileRow | null
  nights: GpReportNight[]
}): GpReportData {
  const profile = input.dlmoProfile
  const hasTipTraqData = Boolean(profile?.nights_count && profile.nights_count > 0)

  const doseWindows = [
    { label: 'Simvastatin (optimal)', time: formatDbTime(profile?.simvastatin_optimal_time ?? null) },
    { label: 'Ramipril (optimal)', time: formatDbTime(profile?.ramipril_optimal_time ?? null) },
    { label: 'Prednisolone (optimal)', time: formatDbTime(profile?.prednisolone_optimal_time ?? null) },
    { label: 'Salmeterol (optimal)', time: formatDbTime(profile?.salmeterol_optimal_time ?? null) },
    {
      label: 'Morning light window',
      time: `${formatDbTime(profile?.light_dose_window_start ?? null)} – ${formatDbTime(profile?.light_dose_window_end ?? null)}`,
    },
  ].filter((window) => window.time !== '—')

  return {
    patientName: input.patientName,
    age: input.age,
    biologicalSex: formatBiologicalSex(input.biologicalSex),
    generatedAt: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    hasTipTraqData,
    nightsCount: profile?.nights_count ?? 0,
    dlmoTime: hasTipTraqData ? formatDbTime(profile?.proxy_dlmo_rolling ?? null) : '—',
    confidenceScore: profile?.confidence_score ?? null,
    confidenceLabel: profile?.confidence_label ?? null,
    confidenceBandMinutes: profile?.confidence_band_minutes ?? null,
    chronotype: profile ? resolveChronotypeLabel(profile) : null,
    doseWindows,
    nights: input.nights.map((night) => ({
      ...night,
      report_date: formatReportDate(night.report_date),
      proxy_dlmo_time: formatDbTime(night.proxy_dlmo_time),
    })),
    dataShareGpEnabled: input.dataShareGp,
  }
}
