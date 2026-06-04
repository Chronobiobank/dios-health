-- Run in Supabase SQL Editor if s.james@tutamail.com cannot sign in or keeps returning to signup.
-- Easiest email fix: Dashboard → Authentication → Users → find user → Confirm user.

-- 1) Does the auth user exist?
select id, email, email_confirmed_at, created_at
from auth.users
where lower(email) = lower('s.james@tutamail.com');

-- 2) Profile rows for that user (paste UUID from step 1)
-- select id, role, full_name from public.profiles where id = 'PASTE_UUID_HERE';
-- select id, first_name, family_name, onboarding_complete from public.patient_profiles where id = 'PASTE_UUID_HERE';

-- 3) If auth user exists but patient row is missing or onboarding_complete is false:
-- insert into public.profiles (id, role, full_name)
-- values ('PASTE_UUID_HERE', 'patient', 'Sean James')
-- on conflict (id) do update set role = 'patient', full_name = 'Sean James';
--
-- insert into public.patient_profiles (
--   id, first_name, family_name, onboarding_complete,
--   location_city, location_country, fitzpatrick_type, date_of_birth, age
-- )
-- values (
--   'PASTE_UUID_HERE', 'Sean', 'James', true,
--   'Auckland', 'New Zealand', 2, date '1978-07-17',
--   extract(year from age(current_date, date '1978-07-17'))::int
-- )
-- on conflict (id) do update set
--   first_name = 'Sean',
--   family_name = 'James',
--   onboarding_complete = true,
--   location_city = coalesce(patient_profiles.location_city, 'Auckland'),
--   location_country = coalesce(patient_profiles.location_country, 'New Zealand'),
--   fitzpatrick_type = coalesce(patient_profiles.fitzpatrick_type, 2),
--   date_of_birth = coalesce(patient_profiles.date_of_birth, date '1978-07-17');
