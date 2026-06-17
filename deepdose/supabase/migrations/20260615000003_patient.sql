CREATE TABLE public.patient_profiles (
  id              UUID PRIMARY KEY REFERENCES public.user_profiles(id),
  date_of_birth   DATE,
  biological_sex  TEXT CHECK (biological_sex IN ('male', 'female', 'other', 'prefer_not')),
  fitzpatrick_type INT CHECK (fitzpatrick_type BETWEEN 1 AND 6),
  postcode_sector TEXT,
  is_shift_worker BOOLEAN DEFAULT FALSE,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.chronotype_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  mctq_version    TEXT DEFAULT 'standard',
  msf_sc          NUMERIC(4,2),
  sjl_hours       NUMERIC(4,2),
  chronotype_cat  TEXT CHECK (chronotype_cat IN ('extreme_early','early','intermediate','late','extreme_late')),
  completed_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.dlmo_estimates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  method          TEXT NOT NULL CHECK (method IN ('tiptraq_l1', 'blood_panel_l2', 'smartphone_l3')),
  dlmo_time       TIME NOT NULL,
  confidence      NUMERIC(3,2),
  phase_offset    NUMERIC(5,2),
  raw_data        JSONB,
  measured_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.circadian_scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  score           NUMERIC(5,2),
  components      JSONB,
  version         TEXT DEFAULT 'v1',
  calculated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.patient_medications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.patient_profiles(id),
  medication_code TEXT NOT NULL,
  dose_mg         NUMERIC(8,2),
  current_timing  TIME,
  prescribed_by   UUID REFERENCES public.user_profiles(id),
  started_at      DATE,
  ended_at        DATE,
  is_active       BOOLEAN DEFAULT TRUE
);

-- RLS
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patients_own_data" ON public.patient_profiles
  FOR ALL USING (id = auth.uid());

ALTER TABLE public.chronotype_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_chronotype" ON public.chronotype_profiles
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.dlmo_estimates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_dlmo" ON public.dlmo_estimates
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.circadian_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_scores" ON public.circadian_scores
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_medications" ON public.patient_medications
  FOR ALL USING (patient_id = auth.uid());
