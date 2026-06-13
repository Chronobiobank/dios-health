-- 031_protocol_fulfillment.sql — Protocol-driven ordering (labs, assessments, supplements)

create table if not exists public.fulfillment_orders (
  id uuid primary key default gen_random_uuid(),
  patient_profile_id uuid not null references public.profiles(id) on delete cascade,
  cohort_patient_ref text,
  ordered_by_profile_id uuid not null references public.profiles(id) on delete cascade,
  order_flow text not null check (order_flow in ('patient_self', 'clinician_for_patient')),
  status text not null default 'open' check (status in ('open', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fulfillment_orders_patient_idx
  on public.fulfillment_orders (patient_profile_id, created_at desc);

create table if not exists public.fulfillment_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.fulfillment_orders(id) on delete cascade,
  item_type text not null check (item_type in ('lab_test', 'supplement', 'assessment')),
  sku text not null,
  provider_id text not null check (provider_id in ('city_labs', 'tiptraq', 'dios_supplements')),
  title text not null,
  status text not null,
  requirement_key text,
  due_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fulfillment_items_order_idx on public.fulfillment_items (order_id);
create index if not exists fulfillment_items_requirement_idx on public.fulfillment_items (requirement_key);

alter table public.fulfillment_orders enable row level security;
alter table public.fulfillment_items enable row level security;

-- Patients read own orders
create policy "Patients read own fulfillment orders"
  on public.fulfillment_orders for select
  using (auth.uid() = patient_profile_id);

create policy "Patients insert own fulfillment orders"
  on public.fulfillment_orders for insert
  with check (auth.uid() = patient_profile_id or auth.uid() = ordered_by_profile_id);

-- Clinicians read linked patient orders
create policy "Clinicians read linked fulfillment orders"
  on public.fulfillment_orders for select
  using (
    exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = fulfillment_orders.patient_profile_id
        and cp.status = 'active'
    )
  );

create policy "Clinicians insert fulfillment orders for linked patients"
  on public.fulfillment_orders for insert
  with check (
    auth.uid() = ordered_by_profile_id
    and exists (
      select 1 from public.clinician_patients cp
      where cp.clinician_id = auth.uid()
        and cp.patient_id = fulfillment_orders.patient_profile_id
        and cp.status = 'active'
    )
  );

-- Items follow order access
create policy "Read fulfillment items via order"
  on public.fulfillment_items for select
  using (
    exists (
      select 1 from public.fulfillment_orders fo
      where fo.id = fulfillment_items.order_id
        and (
          fo.patient_profile_id = auth.uid()
          or exists (
            select 1 from public.clinician_patients cp
            where cp.clinician_id = auth.uid()
              and cp.patient_id = fo.patient_profile_id
              and cp.status = 'active'
          )
        )
    )
  );

create policy "Insert fulfillment items via order"
  on public.fulfillment_items for insert
  with check (
    exists (
      select 1 from public.fulfillment_orders fo
      where fo.id = fulfillment_items.order_id
        and (
          fo.patient_profile_id = auth.uid()
          or fo.ordered_by_profile_id = auth.uid()
        )
    )
  );

create policy "Update fulfillment items via order"
  on public.fulfillment_items for update
  using (
    exists (
      select 1 from public.fulfillment_orders fo
      where fo.id = fulfillment_items.order_id
        and (
          fo.patient_profile_id = auth.uid()
          or exists (
            select 1 from public.clinician_patients cp
            where cp.clinician_id = auth.uid()
              and cp.patient_id = fo.patient_profile_id
              and cp.status = 'active'
          )
        )
    )
  );
