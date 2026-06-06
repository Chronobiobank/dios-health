export type {
  PatientIntegrationRecord,
  PremiumIngestionResult,
  TipTraQClinicalNight,
  WearableTelemetryInsert,
} from '@/lib/dios/premium/types'

export {
  MOCK_TIPTRAQ_CLINICAL_NIGHT,
  MockTipTraQAdapter,
} from '@/lib/dios/premium/mock-tiptraq-adapter'

export {
  configurePremiumTipTraqIngestion,
  verifyPatientPremiumTier,
} from '@/lib/dios/premium/premiumService'
