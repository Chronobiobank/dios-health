-- Prescribing loop, adherence log, reminder settings

ALTER TABLE public.patient_profiles
  ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN NOT NULL DEFAULT TRUE;

CREATE POLICY "patient_update_own_recommendations" ON public.prescribing_recommendations
  FOR UPDATE
  USING (patient_id = auth.uid())
  WITH CHECK (patient_id = auth.uid());

CREATE TABLE public.medication_adherence_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  medication_code TEXT NOT NULL,
  taken_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  in_window       BOOLEAN NOT NULL DEFAULT FALSE,
  source          TEXT NOT NULL DEFAULT 'patient'
                  CHECK (source IN ('patient', 'reminder_ack')),
  recommendation_id UUID REFERENCES public.prescribing_recommendations(id)
);

CREATE TABLE public.medication_reminder_acks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  medication_code TEXT NOT NULL,
  ack_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (patient_id, medication_code, ack_date)
);

ALTER TABLE public.medication_adherence_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_adherence" ON public.medication_adherence_log
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.medication_reminder_acks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_reminder_acks" ON public.medication_reminder_acks
  FOR ALL USING (patient_id = auth.uid());

CREATE POLICY "clinician_read_patient_adherence" ON public.medication_adherence_log
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM public.care_relationships
      WHERE clinician_id = auth.uid() AND active = TRUE
    )
  );

CREATE POLICY "clinician_read_patient_recommendations" ON public.prescribing_recommendations
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM public.care_relationships
      WHERE clinician_id = auth.uid() AND active = TRUE
    )
  );

ALTER TABLE public.prescribing_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_insert_own_outcomes" ON public.prescribing_outcomes
  FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "clinician_read_patient_outcomes" ON public.prescribing_outcomes
  FOR SELECT USING (
    patient_id IN (
      SELECT patient_id FROM public.care_relationships
      WHERE clinician_id = auth.uid() AND active = TRUE
    )
  );
