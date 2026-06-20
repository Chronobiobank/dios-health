-- Chronobiobank ingestion linkage (patient-owned, severable).
-- Keeps the only mapping between a patient and their pseudonymous cohort_token,
-- and tracks which prescribing recommendations have already been contributed so
-- ingestion is idempotent. chronobiobank_records itself stays identifier-free.

CREATE TABLE public.chronobiobank_ingest_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  cohort_token      UUID NOT NULL,
  recommendation_id UUID REFERENCES public.prescribing_recommendations(id),
  record_id         UUID,
  ingested_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (patient_id, recommendation_id)
);

CREATE INDEX chronobiobank_ingest_log_patient_idx
  ON public.chronobiobank_ingest_log (patient_id);

-- The patient owns (and can sever) their own linkage rows.
ALTER TABLE public.chronobiobank_ingest_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_ingest_log" ON public.chronobiobank_ingest_log
  FOR ALL USING (patient_id = auth.uid());
