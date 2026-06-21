-- Track meds onboarding step completion (including skip-with-empty).

ALTER TABLE public.patient_profiles
  ADD COLUMN IF NOT EXISTS onboarding_meds_completed_at TIMESTAMPTZ;
