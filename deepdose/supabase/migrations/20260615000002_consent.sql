CREATE TABLE public.consent_frameworks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version         TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  published_at    TIMESTAMPTZ,
  is_current      BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.consent_purposes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id    UUID REFERENCES public.consent_frameworks(id),
  code            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  is_required     BOOLEAN DEFAULT FALSE
);

CREATE TABLE public.patient_consents (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.user_profiles(id),
  purpose_code    TEXT REFERENCES public.consent_purposes(code),
  framework_id    UUID REFERENCES public.consent_frameworks(id),
  granted         BOOLEAN NOT NULL,
  granted_at      TIMESTAMPTZ,
  withdrawn_at    TIMESTAMPTZ,
  ip_address      INET,
  user_agent      TEXT
);

-- Immutable consent audit log
CREATE TABLE public.consent_audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      UUID REFERENCES public.user_profiles(id),
  purpose_code    TEXT,
  action          TEXT NOT NULL CHECK (action IN ('granted', 'withdrawn', 'viewed', 'exported')),
  actor_id        UUID,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.patient_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_consents" ON public.patient_consents
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.consent_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_read_own_audit" ON public.consent_audit_log
  FOR SELECT USING (patient_id = auth.uid());

-- Seed v1 consent framework
INSERT INTO public.consent_frameworks (version, title, description, is_current, published_at)
VALUES (
  'v1',
  'DeepDose Consent Framework v1',
  'Initial consent framework for DeepDose patient data use',
  TRUE,
  NOW()
);

INSERT INTO public.consent_purposes (framework_id, code, title, description, is_required)
SELECT id, 'clinical_care',   'Your clinical care',         'Sharing your data with your GP for prescribing recommendations', TRUE  FROM public.consent_frameworks WHERE version = 'v1'
UNION ALL
SELECT id, 'icb_licensing',   'NHS population analytics',   'Contributing anonymised data to NHS Integrated Care Board planning', FALSE FROM public.consent_frameworks WHERE version = 'v1'
UNION ALL
SELECT id, 'pharma_rd',       'Pharmaceutical research',    'Contributing anonymised data to pharmaceutical drug development research', FALSE FROM public.consent_frameworks WHERE version = 'v1'
UNION ALL
SELECT id, 'academic',        'Academic research',          'Contributing anonymised data to peer-reviewed academic research', FALSE FROM public.consent_frameworks WHERE version = 'v1';
