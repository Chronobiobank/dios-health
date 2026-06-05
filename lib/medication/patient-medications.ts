import {
  MEDICATION_TIMING_CATALOG,
  type MedicationTimingDefinition,
  normalizeMedicationToken,
} from '@/lib/medication/timing-catalog'

const VALID_MEDICATION_IDS = new Set(MEDICATION_TIMING_CATALOG.map((row) => row.id))

export function normalizeMedicationIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return []
  const seen = new Set<string>()
  const normalized: string[] = []
  for (const id of ids) {
    if (typeof id !== 'string' || !VALID_MEDICATION_IDS.has(id) || seen.has(id)) continue
    seen.add(id)
    normalized.push(id)
  }
  return normalized
}

export function readPatientMedicationList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

/** Match free-text profile entries like "Ramipril 5mg" to catalog modules */
export function medicationEntryMatchesDefinition(
  entry: string,
  definition: MedicationTimingDefinition
): boolean {
  const trimmed = entry.trim()
  if (!trimmed) return false

  const normalized = normalizeMedicationToken(trimmed)
  const id = definition.id
  const nameToken = normalizeMedicationToken(definition.name)

  if (normalized === id || normalized.startsWith(`${id}_`)) return true
  if (normalized.includes(id)) return true
  if (nameToken && normalized.includes(nameToken)) return true
  return new RegExp(`\\b${definition.id}\\b`, 'i').test(trimmed)
}

export function matchPatientMedications(
  currentMedications: string[] | null | undefined
): MedicationTimingDefinition[] {
  const entries = readPatientMedicationList(currentMedications)
  if (entries.length === 0) return []

  const seen = new Set<string>()
  const matched: MedicationTimingDefinition[] = []

  for (const definition of MEDICATION_TIMING_CATALOG) {
    if (seen.has(definition.name)) continue
    const hit = entries.some((entry) => medicationEntryMatchesDefinition(entry, definition))
    if (hit) {
      seen.add(definition.name)
      matched.push(definition)
    }
  }

  return matched
}

export function listUnmatchedPatientMedications(
  currentMedications: string[] | null | undefined
): string[] {
  const entries = readPatientMedicationList(currentMedications)
  return entries.filter(
    (entry) => !MEDICATION_TIMING_CATALOG.some((definition) => medicationEntryMatchesDefinition(entry, definition))
  )
}

/** Catalog ids currently selected on the patient profile */
export function selectedMedicationIdsFromProfile(
  currentMedications: string[] | null | undefined
): string[] {
  return matchPatientMedications(currentMedications).map((definition) => definition.id)
}

/** Persist-friendly labels — catalog display names */
export function medicationLabelsFromIds(ids: readonly string[]): string[] {
  const seen = new Set<string>()
  const labels: string[] = []

  for (const id of ids) {
    const definition = MEDICATION_TIMING_CATALOG.find((row) => row.id === id)
    if (!definition || seen.has(definition.name)) continue
    seen.add(definition.name)
    labels.push(definition.name)
  }

  return labels
}
