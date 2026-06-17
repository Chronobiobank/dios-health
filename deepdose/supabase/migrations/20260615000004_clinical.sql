CREATE TABLE public.care_relationships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id    UUID REFERENCES public.user_profiles(id),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  org_id          UUID REFERENCES public.organisations(id),
  relationship    TEXT DEFAULT 'gp' CHECK (relationship IN ('gp', 'specialist', 'pharmacist')),
  active          BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.prescribing_recommendations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  clinician_id    UUID REFERENCES public.user_profiles(id),
  medication_code TEXT NOT NULL,
  current_timing  TIME,
  recommended_timing TIME NOT NULL,
  rationale       TEXT,
  evidence_refs   JSONB,
  circadian_basis JSONB,
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'accepted', 'declined', 'modified')),
  clinician_note  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  actioned_at     TIMESTAMPTZ
);

CREATE TABLE public.prescribing_outcomes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID REFERENCES public.prescribing_recommendations(id),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  outcome_type    TEXT CHECK (outcome_type IN ('bp_reading','hba1c','symptom_score','adverse_event','adherence')),
  value           NUMERIC,
  unit            TEXT,
  measured_at     TIMESTAMPTZ,
  reported_by     TEXT CHECK (reported_by IN ('patient','clinician','device')),
  notes           TEXT
);

-- RLS: clinicians see only their patients
ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinician_care_access_medications" ON public.patient_medications
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM public.care_relationships
      WHERE clinician_id = auth.uid() AND active = TRUE
    )
  );

ALTER TABLE public.prescribing_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinician_own_recommendations" ON public.prescribing_recommendations
  FOR ALL USING (clinician_id = auth.uid());
CREATE POLICY "patient_read_own_recommendations" ON public.prescribing_recommendations
  FOR SELECT USING (patient_id = auth.uid());
