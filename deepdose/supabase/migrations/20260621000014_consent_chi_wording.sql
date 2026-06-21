-- Align consent purpose copy with CHI / BCA terminology.
UPDATE public.consent_purposes
SET description = 'Share your CHI, dosing windows, and device sync status with your linked clinician (invite code required).'
WHERE code = 'clinical_care'
  AND description = 'Share circadian score, dosing windows, and device sync status with your linked clinician (invite code required).';
