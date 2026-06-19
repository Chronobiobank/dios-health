-- TipTraQ GP program: kit order, 3-night baseline, quarterly review

CREATE TABLE public.tiptraq_assessments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  clinician_id            UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  status                TEXT NOT NULL DEFAULT 'kit_ordered'
                        CHECK (status IN (
                          'kit_ordered',
                          'baseline_in_progress',
                          'baseline_complete',
                          'review_due',
                          'review_complete'
                        )),
  nights_recorded       INT NOT NULL DEFAULT 0,
  nights_required       INT NOT NULL DEFAULT 3,
  kit_ordered_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  baseline_completed_at TIMESTAMPTZ,
  next_review_at        TIMESTAMPTZ,
  metabolic_alert_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  clinician_note        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX tiptraq_assessments_patient_idx ON public.tiptraq_assessments (patient_id);
CREATE INDEX tiptraq_assessments_clinician_idx ON public.tiptraq_assessments (clinician_id);
CREATE INDEX tiptraq_assessments_review_idx ON public.tiptraq_assessments (next_review_at)
  WHERE status IN ('baseline_complete', 'review_due');

ALTER TABLE public.tiptraq_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinician_own_tiptraq_assessments" ON public.tiptraq_assessments
  FOR ALL USING (clinician_id = auth.uid());

CREATE POLICY "patient_read_own_tiptraq" ON public.tiptraq_assessments
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "clinician_care_read_tiptraq" ON public.tiptraq_assessments
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM public.care_relationships
      WHERE clinician_id = auth.uid() AND active = TRUE
    )
  );
