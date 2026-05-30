-- Demo insight seed data
-- Run AFTER creating demo accounts (see comments below)
-- Replace :demo_patient_margaret, etc. with actual profile UUIDs from auth.users

-- Example: insert demo insights for a demo patient UUID
-- Uncomment and set patient_id after demo account exists:

/*
insert into public.insights (patient_id, drug_name, insight_type, insight_headline, insight_body, recommended_time, confidence_score, status)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Ramipril 5mg',
    'blood_pressure',
    'Blood pressure not dipping overnight',
    'Non-dipper confirmed on 6 of 7 nights. Bedtime dosing indicated.',
    '22:00',
    87,
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Simvastatin 20mg',
    'statin',
    'Statin taken before liver activity peaks',
    'Morning dose misses midnight cholesterol synthesis window.',
    '21:30',
    92,
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Prednisolone 5mg',
    'inflammatory',
    'Blood panel needed before timing confirmed',
    'Vitamin D result missing. Cannot confirm entrainment capacity.',
    null,
    null,
    'active'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Simvastatin 10mg',
    'statin',
    'Current timing matches body clock',
    'Evening dose already aligned with liver activity window.',
    '21:00',
    89,
    'active'
  );
*/
