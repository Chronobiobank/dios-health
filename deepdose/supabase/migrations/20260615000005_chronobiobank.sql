-- Pseudonymised research records — no patient_id
CREATE TABLE public.chronobiobank_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_token        UUID NOT NULL,
  age_band            TEXT,
  biological_sex      TEXT,
  fitzpatrick_type    INT,
  chronotype_cat      TEXT,
  sjl_hours           NUMERIC(4,2),
  circadian_score     NUMERIC(5,2),
  medication_code     TEXT,
  prior_timing        TIME,
  recommended_timing  TIME,
  outcome_type        TEXT,
  outcome_value       NUMERIC,
  outcome_unit        TEXT,
  days_to_outcome     INT,
  consent_purposes    TEXT[],
  record_date         DATE,
  schema_version      TEXT DEFAULT 'v1'
);

CREATE TABLE public.data_licenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES public.organisations(id),
  license_type    TEXT CHECK (license_type IN ('icb_population', 'pharma_rd', 'academic')),
  cohort_filter   JSONB,
  purpose_codes   TEXT[],
  start_date      DATE NOT NULL,
  end_date        DATE,
  annual_fee_gbp  NUMERIC(10,2),
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','expired','suspended')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.biobank_access_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id      UUID REFERENCES public.data_licenses(id),
  accessed_by     UUID REFERENCES public.user_profiles(id),
  query_hash      TEXT,
  record_count    INT,
  accessed_at     TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: enterprise access via active license only
ALTER TABLE public.chronobiobank_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "licensed_enterprise_access" ON public.chronobiobank_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.data_licenses dl
      JOIN public.org_members om ON om.org_id = dl.org_id
      WHERE om.user_id = auth.uid()
      AND dl.status = 'active'
      AND (dl.end_date IS NULL OR dl.end_date > NOW())
    )
  );
