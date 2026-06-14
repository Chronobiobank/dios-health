# Protocol Fulfillment

Extension of DIOS Health — protocol-driven ordering, not a general e-commerce store.

## Where it fits

| Surface | Route | Integration |
|---------|-------|-------------|
| Patient dashboard | `/dashboard` | `PatientFulfillmentWidgets` below main dashboard |
| Patient orders | `/dashboard/orders` | Full requirements + order placement |
| Clinician cohort | `/clinic` | `ClinicianFulfillmentWidgets` below pRGC table |
| Clinician orders | `/clinic/orders` | Cohort fulfillment task board |
| Patient record | `/clinic/patients/[id]` | `ProtocolRequirementsPanel` |
| Existing supplement flow | `/clinic/order/[patientId]` | Unchanged — bridges to Stripe where configured |

Navigation: bottom nav **Orders** tab replaces **Shop** (same slot, same pattern) — points to fulfillment routes.

## Data model (migration `031_protocol_fulfillment.sql`)

```
fulfillment_orders
  patient_profile_id → profiles.id
  cohort_patient_ref (optional demo ref)
  ordered_by_profile_id
  order_flow: patient_self | clinician_for_patient
  status: open | completed | cancelled

fulfillment_items
  order_id → fulfillment_orders.id
  item_type: lab_test | supplement | assessment
  sku, provider_id, title, status
  requirement_key (links to protocol requirement)
  due_at, completed_at, metadata
```

App-layer types `LabOrder`, `SupplementOrder`, `AssessmentOrder` are discriminated views over `fulfillment_items` by `item_type`.

## Provider abstraction

`lib/fulfillment/providers.ts` — `city_labs`, `tiptraq`, `dios_supplements`. Add providers without schema changes.

## Protocol requirements engine

`lib/fulfillment/requirements.ts` + `catalog.ts`

1. Read active `patient_protocols.protocol_type` (falls back to demo context).
2. Map protocol → required SKUs from catalog.
3. Merge open orders + clinical data (blood panels, TipTraQ nights).
4. Emit requirement status: `due | ordered | completed | overdue`.

## APIs

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/fulfillment/requirements` | Patient summary or cohort requirements |
| GET | `/api/fulfillment/orders` | List orders for patient |
| POST | `/api/fulfillment/orders` | Create order from requirement keys |

## Status workflows

**Labs:** ordered → dispatched → sample_received → processing → completed → results_imported

**TipTraQ:** order_kit → shipped → completed → report_available → clinician_reviewed

**Supplements:** due → ordered → dispatched → completed

## Implementation phases

### Phase 1 (this PR) — Foundation
- Schema + RLS (`031_protocol_fulfillment.sql`, `032_product_spine.sql`)
- Domain layer + APIs
- Patient/clinician widgets + orders pages
- Protocol requirements panel on patient record
- Honest empty states (no demo order masking when tables exist)
- Ingest hooks: blood panels → `results_imported`; TipTraQ → `report_available`

### Phase 2 — Shop + clinic cohort
- `POST /api/shop/checkout` mirrors mapped supplement SKUs into `fulfillment_orders` / `fulfillment_items`
- `/clinic` and `/clinic/orders` load cohort from `clinician_triage_dashboard` when clinician has linked patients; demo pRGC rows otherwise

### Phase 2 — Persistence + ingestion
- Run migration on Supabase production
- Wire `POST /api/ingest/labs` to set lab items `results_imported`
- Wire TipTraQ webhook to advance assessment items
- Replace in-memory supplement queue with `fulfillment_items`

### Phase 3 — Clinician actions
- Bulk order from cohort table
- Review queue for `report_available` / `results_imported`
- Email/webhook to City Labs + TipTraQ fulfilment partners

## Deploy notes

1. Apply `supabase/migrations/031_protocol_fulfillment.sql`
2. No navigation shell redesign — only tab href/label change
3. Legacy `/shop` routes remain; redirect in `next.config.ts` unchanged
