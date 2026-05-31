-- Patient supplement list for Timebot / Insights timing (Layer 1+ protocol support)
-- Run in Supabase SQL Editor after review — do not run until confirmed

alter table public.patient_profiles
  add column if not exists current_supplements text[] not null default '{}'::text[];

comment on column public.patient_profiles.current_supplements is
  'Canonical supplement names (Vitamin D3, Magnesium, etc.) extracted by Timebot or set in profile.';

create index if not exists patient_profiles_current_supplements_idx
  on public.patient_profiles using gin (current_supplements);
