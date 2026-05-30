-- Patient demographics for personalised dashboard and clinical context
-- Run in Supabase SQL Editor or via: supabase db push

alter table public.patient_profiles
  add column if not exists first_name text,
  add column if not exists family_name text,
  add column if not exists age int check (age is null or (age >= 13 and age <= 120)),
  add column if not exists biological_sex text check (
    biological_sex is null or biological_sex in ('female', 'male', 'intersex', 'prefer_not_to_say')
  );
