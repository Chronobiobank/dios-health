alter table public.clinician_profiles
  add column if not exists onboarding_complete boolean not null default false;
