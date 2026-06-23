-- Enable RLS on public tables that were created without it (Supabase rls_disabled_in_public).
-- Reference catalogs: authenticated read-only. Identity/org: member-scoped. No anon access.

-- ── user_profiles ─────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_read_own_profile" ON public.user_profiles;
CREATE POLICY "user_read_own_profile" ON public.user_profiles
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "user_update_own_profile" ON public.user_profiles;
CREATE POLICY "user_update_own_profile" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "care_link_read_profiles" ON public.user_profiles;
CREATE POLICY "care_link_read_profiles" ON public.user_profiles
  FOR SELECT USING (
    id IN (
      SELECT cr.patient_id FROM public.care_relationships cr
      WHERE cr.clinician_id = auth.uid() AND cr.active = TRUE
    )
    OR id IN (
      SELECT cr.clinician_id FROM public.care_relationships cr
      WHERE patient_id = auth.uid() AND cr.active = TRUE
    )
  );

-- ── organisations / org_members ───────────────────────────────────────────────
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_member_read_org" ON public.organisations;
CREATE POLICY "org_member_read_org" ON public.organisations
  FOR SELECT USING (
    id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_read_own_memberships" ON public.org_members;
CREATE POLICY "user_read_own_memberships" ON public.org_members
  FOR SELECT USING (user_id = auth.uid());

-- ── consent reference (non-PII) ───────────────────────────────────────────────
ALTER TABLE public.consent_frameworks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_consent_frameworks" ON public.consent_frameworks;
CREATE POLICY "authenticated_read_consent_frameworks" ON public.consent_frameworks
  FOR SELECT TO authenticated USING (true);

ALTER TABLE public.consent_purposes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_consent_purposes" ON public.consent_purposes;
CREATE POLICY "authenticated_read_consent_purposes" ON public.consent_purposes
  FOR SELECT TO authenticated USING (true);

-- ── medications catalog (reference data — read-only for signed-in users) ──────
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_read_medications_catalog" ON public.medications;
CREATE POLICY "authenticated_read_medications_catalog" ON public.medications
  FOR SELECT TO authenticated USING (true);

-- ── enterprise licensing ────────────────────────────────────────────────────
ALTER TABLE public.data_licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_member_read_licenses" ON public.data_licenses;
CREATE POLICY "org_member_read_licenses" ON public.data_licenses
  FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.org_members WHERE user_id = auth.uid())
  );

ALTER TABLE public.biobank_access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "org_member_read_access_log" ON public.biobank_access_log;
CREATE POLICY "org_member_read_access_log" ON public.biobank_access_log
  FOR SELECT USING (
    license_id IN (
      SELECT dl.id
      FROM public.data_licenses dl
      JOIN public.org_members om ON om.org_id = dl.org_id
      WHERE om.user_id = auth.uid()
    )
  );
