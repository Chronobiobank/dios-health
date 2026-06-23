-- 034_orphan_clinical_rls.sql
-- Tighten legacy clinical tables (worker_id → workers) and clean lead-capture policies.

-- ─── Helper: scoped read/write via workers.organization_id ───────────────────

create or replace function public.worker_clinical_row_visible(p_worker_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workers w
    where w.id = p_worker_id
      and (
        w.auth_user_id = auth.uid()
        or public.is_org_member(w.organization_id)
      )
  );
$$;

create or replace function public.worker_clinical_row_writable(p_worker_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workers w
    where w.id = p_worker_id
      and public.is_org_member(
        w.organization_id,
        array['owner', 'admin', 'clinical', 'employer']
      )
  );
$$;

-- ─── city_labs_results ───────────────────────────────────────────────────────

do $$
begin
  if to_regclass('public.city_labs_results') is null then
    return;
  end if;

  execute 'alter table public.city_labs_results enable row level security';
  execute 'drop policy if exists "clinical_access_city_labs" on public.city_labs_results';
  execute 'drop policy if exists "Read city labs results" on public.city_labs_results';
  execute 'drop policy if exists "Clinical roles write city labs results" on public.city_labs_results';

  execute $policy$
    create policy "Read city labs results"
      on public.city_labs_results for select to authenticated
      using (public.worker_clinical_row_visible(worker_id))
  $policy$;

  execute $policy$
    create policy "Clinical roles write city labs results"
      on public.city_labs_results for all to authenticated
      using (public.worker_clinical_row_writable(worker_id))
      with check (public.worker_clinical_row_writable(worker_id))
  $policy$;
end $$;

-- ─── oct_pipr_results ────────────────────────────────────────────────────────

do $$
begin
  if to_regclass('public.oct_pipr_results') is null then
    return;
  end if;

  execute 'alter table public.oct_pipr_results enable row level security';
  execute 'drop policy if exists "clinical_access_oct" on public.oct_pipr_results';
  execute 'drop policy if exists "Read oct pipr results" on public.oct_pipr_results';
  execute 'drop policy if exists "Clinical roles write oct pipr results" on public.oct_pipr_results';

  execute $policy$
    create policy "Read oct pipr results"
      on public.oct_pipr_results for select to authenticated
      using (public.worker_clinical_row_visible(worker_id))
  $policy$;

  execute $policy$
    create policy "Clinical roles write oct pipr results"
      on public.oct_pipr_results for all to authenticated
      using (public.worker_clinical_row_writable(worker_id))
      with check (public.worker_clinical_row_writable(worker_id))
  $policy$;
end $$;

-- ─── tiptraq_nightly_reports ───────────────────────────────────────────────────

do $$
begin
  if to_regclass('public.tiptraq_nightly_reports') is null then
    return;
  end if;

  execute 'alter table public.tiptraq_nightly_reports enable row level security';
  execute 'drop policy if exists "clinical_access_tiptraq" on public.tiptraq_nightly_reports';
  execute 'drop policy if exists "Read tiptraq nightly reports" on public.tiptraq_nightly_reports';
  execute 'drop policy if exists "Clinical roles write tiptraq nightly reports" on public.tiptraq_nightly_reports';

  execute $policy$
    create policy "Read tiptraq nightly reports"
      on public.tiptraq_nightly_reports for select to authenticated
      using (public.worker_clinical_row_visible(worker_id))
  $policy$;

  execute $policy$
    create policy "Clinical roles write tiptraq nightly reports"
      on public.tiptraq_nightly_reports for all to authenticated
      using (public.worker_clinical_row_writable(worker_id))
      with check (public.worker_clinical_row_writable(worker_id))
  $policy$;
end $$;

-- ─── demo_requests: remove duplicate/deny policies; validate public inserts ───

do $$
begin
  if to_regclass('public.demo_requests') is null then
    return;
  end if;

  execute 'alter table public.demo_requests enable row level security';
  execute 'drop policy if exists "public can insert" on public.demo_requests';
  execute 'drop policy if exists "Service role only" on public.demo_requests';
  execute 'drop policy if exists "Anyone can submit demo request" on public.demo_requests';
  execute 'drop policy if exists "Public can submit demo request" on public.demo_requests';
  execute 'drop policy if exists "Service role reads demo requests" on public.demo_requests';

  execute $policy$
    create policy "Public can submit demo request"
      on public.demo_requests for insert
      to anon, authenticated
      with check (
        coalesce(length(trim(full_name)), 0) > 0
        and coalesce(length(trim(email)), 0) > 3
        and position('@' in email) > 1
        and coalesce(length(trim(organisation)), 0) > 0
      )
  $policy$;

  execute $policy$
    create policy "Service role reads demo requests"
      on public.demo_requests for select
      using ((select auth.role()) = 'service_role')
  $policy$;
end $$;

-- ─── inquiries: validate public inserts; service_role read only ──────────────

do $$
begin
  if to_regclass('public.inquiries') is null then
    return;
  end if;

  execute 'alter table public.inquiries enable row level security';
  execute 'drop policy if exists "inquiries_insert_public" on public.inquiries';
  execute 'drop policy if exists "inquiries_select_service" on public.inquiries';
  execute 'drop policy if exists "Public can submit inquiry" on public.inquiries';
  execute 'drop policy if exists "Service role reads inquiries" on public.inquiries';

  execute $policy$
    create policy "Public can submit inquiry"
      on public.inquiries for insert
      to anon, authenticated
      with check (
        coalesce(length(trim(full_name)), 0) > 0
        and coalesce(length(trim(email)), 0) > 3
        and position('@' in email) > 1
      )
  $policy$;

  execute $policy$
    create policy "Service role reads inquiries"
      on public.inquiries for select
      using ((select auth.role()) = 'service_role')
  $policy$;
end $$;
