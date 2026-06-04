-- Chronoprofile: account signup leaves onboarding_complete false until demographics wizard finishes.

create or replace function public.complete_patient_signup(
  p_first_name text,
  p_family_name text default null,
  p_research_consent boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_full_name text;
  v_family text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_first_name is null or btrim(p_first_name) = '' then
    raise exception 'First name is required';
  end if;

  v_family := nullif(btrim(coalesce(p_family_name, '')), '');
  v_full_name := btrim(p_first_name) || case
    when v_family is not null then ' ' || v_family
    else ''
  end;

  insert into public.profiles (id, role, full_name, terms_accepted_at)
  values (v_user_id, 'patient', v_full_name, now())
  on conflict (id) do update
  set
    role = 'patient',
    full_name = excluded.full_name,
    terms_accepted_at = coalesce(public.profiles.terms_accepted_at, now());

  insert into public.patient_profiles (
    id,
    first_name,
    family_name,
    onboarding_complete
  )
  values (
    v_user_id,
    btrim(p_first_name),
    v_family,
    false
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    family_name = excluded.family_name;

  insert into public.chronobiobank_consent (
    patient_id,
    clinical_consent,
    research_consent,
    consent_version
  )
  values (
    v_user_id,
    true,
    coalesce(p_research_consent, false),
    'v1.0'
  )
  on conflict (patient_id) do update
  set
    clinical_consent = true,
    research_consent = excluded.research_consent,
    consent_version = excluded.consent_version,
    updated_at = now();

  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.complete_patient_chronoprofile(
  p_age integer,
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
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_age is null or p_age < 13 or p_age > 120 then
    raise exception 'Enter a valid age between 13 and 120';
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
    age = p_age,
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
  integer, text, integer, text, text, boolean, text, text, text, text
) from public;
grant execute on function public.complete_patient_chronoprofile(
  integer, text, integer, text, text, boolean, text, text, text, text
) to authenticated;

notify pgrst, 'reload schema';
