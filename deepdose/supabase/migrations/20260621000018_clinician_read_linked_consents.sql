-- Clinicians must read linked patients' clinical_care consent rows so that
-- patient_profiles / chronotype_profiles RLS EXISTS checks succeed in triage.

CREATE POLICY "clinician_read_linked_patient_consents" ON public.patient_consents
  FOR SELECT USING (
    patient_id IN (
      SELECT cr.patient_id
      FROM public.care_relationships cr
      WHERE cr.clinician_id = auth.uid()
        AND cr.active = TRUE
    )
  );
