-- Run in Supabase SQL editor if migration 017 is not applied yet.
-- Sean James — birthday 17 July 1978 (NZ: 17/07/1978)

alter table public.patient_profiles
  add column if not exists date_of_birth date;

update public.patient_profiles
set
  date_of_birth = date '1978-07-17',
  age = extract(year from age(current_date, date '1978-07-17'))::int
where lower(trim(coalesce(first_name, ''))) = 'sean'
  and lower(trim(coalesce(family_name, ''))) = 'james';

select id, first_name, family_name, age, date_of_birth
from public.patient_profiles
where lower(trim(coalesce(first_name, ''))) = 'sean'
  and lower(trim(coalesce(family_name, ''))) = 'james';
