import type { SupabaseClient } from '@supabase/supabase-js'

// Three-tier DLMO resolution: clinical TipTraQ (L1) > blood panel (L2) >
// smartphone/wearable proxy (L3). Reads the latest dlmo_estimates row for each
// method and picks the dominant source by confidence (0–1 scale).

export type DlmoMethod = 'tiptraq_l1' | 'blood_panel_l2' | 'smartphone_l3'

const TIPTRAQ_DOMINANCE_THRESHOLD = 0.4
const BLOOD_DOMINANCE_THRESHOLD = 0.3

export type LayerReading = {
  dlmoTime: string
  dlmoMinutes: number
  confidence: number | null
  measuredAt: string
}

export type CanonicalDlmo = {
  available: boolean
  dominantLayer: DlmoMethod | null
  dlmoTime: string | null
  dlmoMinutes: number | null
  confidence: number | null
  layers: Record<DlmoMethod, LayerReading | null>
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return ((h * 60 + (m || 0)) % 1440 + 1440) % 1440
}

const EMPTY: CanonicalDlmo = {
  available: false,
  dominantLayer: null,
  dlmoTime: null,
  dlmoMinutes: null,
  confidence: null,
  layers: { tiptraq_l1: null, blood_panel_l2: null, smartphone_l3: null },
}

type EstimateRow = {
  method: string
  dlmo_time: string
  confidence: number | null
  measured_at: string
}

export async function resolveCanonicalDlmo(
  supabase: SupabaseClient,
  patientId: string
): Promise<CanonicalDlmo> {
  const { data } = await supabase
    .from('dlmo_estimates')
    .select('method, dlmo_time, confidence, measured_at')
    .eq('patient_id', patientId)
    .order('measured_at', { ascending: false })

  const rows = (data ?? []) as EstimateRow[]

  const layers: Record<DlmoMethod, LayerReading | null> = {
    tiptraq_l1: null,
    blood_panel_l2: null,
    smartphone_l3: null,
  }

  // Rows are newest-first, so the first occurrence of each method wins.
  for (const row of rows) {
    if (!row.dlmo_time) continue
    const method = row.method as DlmoMethod
    if (!(method in layers) || layers[method]) continue
    layers[method] = {
      dlmoTime: row.dlmo_time.slice(0, 5),
      dlmoMinutes: timeToMinutes(row.dlmo_time),
      confidence: row.confidence != null ? Number(row.confidence) : null,
      measuredAt: row.measured_at,
    }
  }

  const tiptraq = layers.tiptraq_l1
  const blood = layers.blood_panel_l2
  const smartphone = layers.smartphone_l3

  let dominant: DlmoMethod | null = null
  if (tiptraq && (tiptraq.confidence ?? 0) >= TIPTRAQ_DOMINANCE_THRESHOLD) {
    dominant = 'tiptraq_l1'
  } else if (blood && (blood.confidence ?? 0) >= BLOOD_DOMINANCE_THRESHOLD) {
    dominant = 'blood_panel_l2'
  } else if (smartphone) {
    dominant = 'smartphone_l3'
  } else if (tiptraq) {
    dominant = 'tiptraq_l1'
  } else if (blood) {
    dominant = 'blood_panel_l2'
  }

  if (!dominant) return EMPTY

  const chosen = layers[dominant]!
  return {
    available: true,
    dominantLayer: dominant,
    dlmoTime: chosen.dlmoTime,
    dlmoMinutes: chosen.dlmoMinutes,
    confidence: chosen.confidence,
    layers,
  }
}
