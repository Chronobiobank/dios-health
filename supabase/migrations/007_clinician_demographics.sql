-- Clinician name fields for personalised clinic greeting (Dr {family name})
-- Run in Supabase SQL Editor or via: supabase db push

alter table public.clinician_profiles
  add column if not exists first_name text,
  add column if not exists family_name text;
