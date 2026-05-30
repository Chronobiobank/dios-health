-- Patient onboarding completion + terms acceptance audit trail
-- Run in Supabase SQL Editor or via: supabase db push

alter table public.patient_profiles
  add column if not exists onboarding_complete boolean not null default false;

alter table public.profiles
  add column if not exists terms_accepted_at timestamptz;
