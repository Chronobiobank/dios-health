-- Date of birth for chronological age (dashboard + profile).

alter table public.patient_profiles
  add column if not exists date_of_birth date;

comment on column public.patient_profiles.date_of_birth is
  'Patient date of birth (calendar date). Age on dashboard can be derived from this.';

-- Sean James — 17/07/1978
update public.patient_profiles
set
  date_of_birth = date '1978-07-17',
  age = extract(year from age(current_date, date '1978-07-17'))::int
where lower(trim(coalesce(first_name, ''))) = 'sean'
  and lower(trim(coalesce(family_name, ''))) = 'james';
