-- Patient-facing consent onboarding copy.
UPDATE public.consent_frameworks
SET
  title = 'Consent Framework',
  description = NULL
WHERE version = 'v1'
  AND title = 'DeepDose Consent Framework v1';
