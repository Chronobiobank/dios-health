/**
 * DIOS core OS — patient identity, consent, session logging, data ingestion contracts.
 * Application routes and UI live under `app/`; clinical modules under `lib/dashboard`, `lib/coach`, etc.
 */
export { MEL_SESSIONS_TABLE } from '@/lib/dios/constants/tables'
export {
  melSessionsTable,
  type MelSessionInsert,
  type MelSessionRow,
} from '@/lib/dios/core/mel-sessions'
export {
  MOCK_INGESTION_SYNC_REFERENCE,
  MOCK_PERSONA_KEYS,
  MockIngestionDataGenerator,
  type HrvSample,
  type HrvStream,
  type IngestionLayerPayload,
  type LightStream,
  type MockIngestionGeneratorOptions,
  type MockPersonaKey,
  type SleepStream,
  type WearableIntegrationState,
} from '@/lib/dios/ingestion'
export {
  calculateBiologicalWindow,
  simulateBiologicalWindowFromTelemetry,
  type BtiEnginePayload,
  type BtiStatus,
  type ChronobiobankTelemetryInsert,
  type IngestionTier,
  type WearableTelemetryLogRow,
} from '@/lib/dios/bti'
export {
  configurePremiumTipTraqIngestion,
  verifyPatientPremiumTier,
  MockTipTraQAdapter,
  MOCK_TIPTRAQ_CLINICAL_NIGHT,
  type PremiumIngestionResult,
  type PatientIntegrationRecord,
} from '@/lib/dios/premium'
