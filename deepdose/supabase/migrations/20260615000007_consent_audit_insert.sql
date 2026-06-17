-- Allow patients to append their own consent audit entries
CREATE POLICY "patient_insert_own_audit" ON public.consent_audit_log
  FOR INSERT WITH CHECK (patient_id = auth.uid());

-- One consent record per patient + purpose
CREATE UNIQUE INDEX patient_consents_patient_purpose_idx
  ON public.patient_consents (patient_id, purpose_code);
