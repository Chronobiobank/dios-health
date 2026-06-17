-- Care linking + wearable ingestion (DeepDose v0 bridge)

ALTER TABLE public.patient_profiles
  ADD COLUMN IF NOT EXISTS is_premium_tier BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS device_alert_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_device_sync_at TIMESTAMPTZ;

CREATE TABLE public.clinician_invite_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinician_id    UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  code            TEXT NOT NULL UNIQUE,
  org_id          UUID REFERENCES public.organisations(id),
  expires_at      TIMESTAMPTZ,
  max_uses        INT NOT NULL DEFAULT 50,
  use_count       INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX clinician_invite_codes_clinician_idx ON public.clinician_invite_codes (clinician_id);

CREATE TABLE public.wearable_connections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  provider          TEXT NOT NULL CHECK (provider IN ('oura', 'whoop', 'apple_health')),
  access_token      TEXT,
  refresh_token     TEXT,
  token_expires_at  TIMESTAMPTZ,
  scopes            TEXT[],
  connected_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sync_at      TIMESTAMPTZ,
  sync_status       TEXT NOT NULL DEFAULT 'idle'
                    CHECK (sync_status IN ('idle', 'syncing', 'ok', 'error')),
  last_error        TEXT,
  UNIQUE (patient_id, provider)
);

CREATE TABLE public.wearable_sleep_logs (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id                  UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  provider                    TEXT NOT NULL,
  external_id                 TEXT NOT NULL,
  sleep_onset_timestamp       TIMESTAMPTZ NOT NULL,
  wake_timestamp              TIMESTAMPTZ NOT NULL,
  deep_sleep_duration_minutes INT,
  rem_duration_minutes        INT,
  synced_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (patient_id, provider, external_id)
);

CREATE INDEX wearable_sleep_logs_patient_synced_idx
  ON public.wearable_sleep_logs (patient_id, synced_at DESC);

-- care_relationships RLS
ALTER TABLE public.care_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patient_read_own_care" ON public.care_relationships
  FOR SELECT USING (patient_id = auth.uid());

CREATE POLICY "clinician_read_own_care" ON public.care_relationships
  FOR SELECT USING (clinician_id = auth.uid());

CREATE POLICY "clinician_care_access_profiles" ON public.patient_profiles
  FOR SELECT USING (
    id IN (
      SELECT cr.patient_id FROM public.care_relationships cr
      WHERE cr.clinician_id = auth.uid() AND cr.active = TRUE
    )
    AND EXISTS (
      SELECT 1 FROM public.patient_consents pc
      WHERE pc.patient_id = patient_profiles.id
        AND pc.purpose_code = 'clinical_care'
        AND pc.granted = TRUE
        AND pc.withdrawn_at IS NULL
    )
  );

CREATE POLICY "clinician_care_access_chronotype" ON public.chronotype_profiles
  FOR SELECT USING (
    patient_id IN (
      SELECT cr.patient_id FROM public.care_relationships cr
      WHERE cr.clinician_id = auth.uid() AND cr.active = TRUE
    )
    AND EXISTS (
      SELECT 1 FROM public.patient_consents pc
      WHERE pc.patient_id = chronotype_profiles.patient_id
        AND pc.purpose_code = 'clinical_care'
        AND pc.granted = TRUE
        AND pc.withdrawn_at IS NULL
    )
  );

ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_wearables" ON public.wearable_connections
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.wearable_sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "patient_own_sleep_logs" ON public.wearable_sleep_logs
  FOR ALL USING (patient_id = auth.uid());

ALTER TABLE public.clinician_invite_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clinician_own_invites" ON public.clinician_invite_codes
  FOR ALL USING (clinician_id = auth.uid());

UPDATE public.consent_purposes
SET description = 'Share circadian score, dosing windows, and device sync status with your linked clinician (invite code required).'
WHERE code = 'clinical_care';
