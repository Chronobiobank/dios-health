-- User profiles (extends auth.users)
CREATE TABLE public.user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier            TEXT NOT NULL DEFAULT 'patient'
                  CHECK (tier IN ('patient', 'clinician', 'enterprise')),
  display_name    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.organisations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  org_type        TEXT NOT NULL CHECK (org_type IN ('gp_practice', 'icb', 'pharma', 'research')),
  tier            TEXT NOT NULL CHECK (tier IN ('clinical', 'enterprise')),
  contract_start  DATE,
  contract_end    DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.org_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID REFERENCES public.organisations(id),
  user_id         UUID REFERENCES public.user_profiles(id),
  role            TEXT NOT NULL CHECK (role IN ('admin', 'clinician', 'analyst', 'viewer')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
