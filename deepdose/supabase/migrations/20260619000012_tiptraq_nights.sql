-- TipTraQ per-night clinical readings (ported from dios-health tiptraq_nights)

CREATE TABLE public.tiptraq_nights (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id              UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  assessment_id           UUID REFERENCES public.tiptraq_assessments(id) ON DELETE SET NULL,
  clinician_id            UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  report_date             DATE NOT NULL,
  night_index             INT,
  day_type                TEXT CHECK (day_type IN ('weekday', 'weekend')),
  pdf_path                TEXT,

  sleep_onset             TIME,
  sleep_offset            TIME,
  sleep_latency_minutes   INT,
  tst_minutes             INT,
  waso_minutes            INT,
  sleep_efficiency_pct    INT,
  rem_duration_minutes    INT,
  rem_pct_tst             NUMERIC(5,2),
  first_rem_onset         TIME,
  ahi                     NUMERIC(5,2),
  ahi_severity            TEXT,
  min_spo2                INT,
  mean_pr                 INT,
  min_pr                  INT,
  sns_pct                 INT,
  pns_pct                 INT,
  hypoxic_burden          NUMERIC(6,2),
  signal_quality_pct      INT,

  proxy_dlmo_time         TIME,
  confidence_score        INT,
  confidence_label        TEXT,
  chronotype_signal       TEXT,
  apnea_confound_flag     BOOLEAN NOT NULL DEFAULT FALSE,
  high_sympathetic_flag   BOOLEAN NOT NULL DEFAULT FALSE,
  rem_delay_flag          BOOLEAN NOT NULL DEFAULT FALSE,

  clinician_note          TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (patient_id, report_date)
);

CREATE INDEX tiptraq_nights_patient_date_idx
  ON public.tiptraq_nights (patient_id, report_date DESC);

CREATE INDEX tiptraq_nights_assessment_idx
  ON public.tiptraq_nights (assessment_id)
  WHERE assessment_id IS NOT NULL;

ALTER TABLE public.tiptraq_nights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinician_manage_tiptraq_nights" ON public.tiptraq_nights
  FOR ALL USING (
    clinician_id = auth.uid()
    OR patient_id IN (
      SELECT patient_id FROM public.care_relationships
      WHERE clinician_id = auth.uid() AND active = TRUE
    )
  );

CREATE POLICY "patient_read_own_tiptraq_nights" ON public.tiptraq_nights
  FOR SELECT USING (patient_id = auth.uid());
