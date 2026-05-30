-- Saves patient demographics via Postgres (avoids PostgREST stale schema cache on new columns).
-- Run in Supabase SQL Editor after 006/009, then: NOTIFY pgrst, 'reload schema';

create or replace function public.save_patient_demographics(
  p_first_name text,
  p_family_name text,
  p_age integer,
  p_biological_sex text,
  p_accept_terms boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_full_name text;
  v_has_terms boolean;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if p_first_name is null or btrim(p_first_name) = '' then
    raise exception 'First and family name are required';
  end if;

  if p_family_name is null or btrim(p_family_name) = '' then
    raise exception 'First and family name are required';
  end if;

  if p_biological_sex is null or btrim(p_biological_sex) = '' then
    raise exception 'Biological sex is required';
  end if;

  if p_age is null or p_age < 13 or p_age > 120 then
    raise exception 'Enter a valid age between 13 and 120';
  end if;

  select terms_accepted_at is not null
  into v_has_terms
  from public.profiles
  where id = v_user_id;

  if coalesce(v_has_terms, false) = false and not coalesce(p_accept_terms, false) then
    raise exception 'You must accept the Terms of Service and Privacy Policy';
  end if;

  v_full_name := btrim(p_first_name) || ' ' || btrim(p_family_name);

  insert into public.profiles (id, role, full_name, terms_accepted_at)
  values (
    v_user_id,
    'patient',
    v_full_name,
    case when coalesce(p_accept_terms, false) then now() else null end
  )
  on conflict (id) do update
  set
    role = 'patient',
    full_name = excluded.full_name,
    terms_accepted_at = case
      when public.profiles.terms_accepted_at is not null then public.profiles.terms_accepted_at
      when coalesce(p_accept_terms, false) then now()
      else public.profiles.terms_accepted_at
    end;

  insert into public.patient_profiles (
    id,
    first_name,
    family_name,
    age,
    biological_sex
  )
  values (
    v_user_id,
    btrim(p_first_name),
    btrim(p_family_name),
    p_age,
    btrim(p_biological_sex)
  )
  on conflict (id) do update
  set
    first_name = excluded.first_name,
    family_name = excluded.family_name,
    age = excluded.age,
    biological_sex = excluded.biological_sex;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.save_patient_demographics(text, text, integer, text, boolean) from public;
grant execute on function public.save_patient_demographics(text, text, integer, text, boolean) to authenticated;

notify pgrst, 'reload schema';
