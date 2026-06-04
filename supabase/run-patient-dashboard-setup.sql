-- DIOS patient signup + chronoprofile (run once in Supabase → SQL Editor → Run)
--
-- First-time / signup errors: run sections 1–3 below (018 + 019).
-- Step 5 "Database setup incomplete": run section 4 only (021).
--
-- Full migration files (same content, split for version control):
--   supabase/migrations/018_complete_patient_signup.sql
--   supabase/migrations/019_fix_auth_signup_trigger.sql
--   supabase/migrations/021_chronoprofile_date_of_birth.sql

-- ═══════════════════════════════════════════════════════════════════════════
-- 4) Chronoprofile RPC (date of birth) — fixes step 5 of 5
-- ═══════════════════════════════════════════════════════════════════════════

drop function if exists public.complete_patient_chronoprofile(
  integer, text, integer, text, text, boolean, text, text, text, text
);

create or replace function public.complete_patient_chronoprofile(
  p_date_of_birth date,
  p_biological_sex text,
  p_fitzpatrick_type integer,
  p_location_city text,
  p_location_country text,
  p_shift_worker boolean,
  p_shift_pattern text,
  p_chronotype_q1 text,
  p_chronotype_q2 text,
  p_chronotype_q3 text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_age integer;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_date_of_birth is null then
    raise exception 'Date of birth is required';
  end if;

  if p_date_of_birth > current_date then
    raise exception 'Date of birth cannot be in the future';
  end if;

  v_age := extract(year from age(current_date, p_date_of_birth))::integer;

  if v_age < 13 or v_age > 120 then
    raise exception 'Enter a valid date of birth';
  end if;

  if p_biological_sex is null or btrim(p_biological_sex) = '' then
    raise exception 'Biological sex is required';
  end if;

  if p_fitzpatrick_type is null or p_fitzpatrick_type < 1 or p_fitzpatrick_type > 6 then
    raise exception 'Skin type is required';
  end if;

  if p_location_city is null or btrim(p_location_city) = '' then
    raise exception 'City is required';
  end if;

  if p_location_country is null or btrim(p_location_country) = '' then
    raise exception 'Country is required';
  end if;

  if p_chronotype_q1 is null or btrim(p_chronotype_q1) = '' then
    raise exception 'Wake time is required';
  end if;

  if p_chronotype_q2 is null or btrim(p_chronotype_q2) = '' then
    raise exception 'Alertness window is required';
  end if;

  if p_chronotype_q3 is null or btrim(p_chronotype_q3) = '' then
    raise exception 'Sleep time is required';
  end if;

  update public.patient_profiles
  set
    date_of_birth = p_date_of_birth,
    age = v_age,
    biological_sex = btrim(p_biological_sex),
    fitzpatrick_type = p_fitzpatrick_type,
    location_city = btrim(p_location_city),
    location_country = btrim(p_location_country),
    shift_worker = coalesce(p_shift_worker, false),
    shift_pattern = case
      when coalesce(p_shift_worker, false) then nullif(btrim(coalesce(p_shift_pattern, '')), '')
      else null
    end,
    chronotype_q1 = btrim(p_chronotype_q1),
    chronotype_q2 = btrim(p_chronotype_q2),
    chronotype_q3 = btrim(p_chronotype_q3),
    onboarding_complete = true
  where id = v_user_id;

  if not found then
    raise exception 'Patient profile not found';
  end if;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.complete_patient_chronoprofile(
  date, text, integer, text, text, boolean, text, text, text, text
) from public;
grant execute on function public.complete_patient_chronoprofile(
  date, text, integer, text, text, boolean, text, text, text, text
) to authenticated;

alter table public.patient_profiles
  add column if not exists date_of_birth date,
  add column if not exists onboarding_complete boolean not null default false;

notify pgrst, 'reload schema';
