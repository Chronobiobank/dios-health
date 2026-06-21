# Clinical demo checklist

Use this before a **guided** clinician walkthrough (15–20 min). Not for unsupervised real clinical use.

**Demo URL:** https://deepdose.org (or your Vercel preview)  
**Landing:** `/clinician-landing` → Sign in

---

## 1. One-time environment prep

Run from `deepdose/` with `.env.local` populated (`NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`).

- [ ] **Build passes:** `npm run build`
- [ ] **Migrations applied:** `npx supabase db push --yes`
- [ ] **Latest code deployed:** commit → push → `node scripts/deploy.mjs` (or Vercel Git deploy)
- [ ] **Supabase connectivity:** `node scripts/check-supabase.mjs`

---

## 2. Seed demo data (same day as demo)

Idempotent — safe to re-run.

```powershell
cd deepdose
node --env-file=.env.local scripts/seed-clinician-demo.mjs
```

Optional — richer patient side (meds, Oura nights, TipTraQ block on linked patient):

```powershell
node --env-file=.env.local scripts/seed-patient-demo.mjs
```

**Clinician login**

| Field | Value |
|-------|--------|
| Email | `clinician-demo@deepdose.org` |
| Password | `DemoClinical!2026` |
| Entry | `/login?next=/clinical/dashboard` |

**Panel patients (after seed)**

| Name | Triage signal |
|------|----------------|
| Maya Okonkwo | Device alert · premium TipTraQ badge |
| James Reid | Low CHI / review (social jet lag) |
| Priya Sharma | On track |

**Optional patient login** (for “accept recommendation” beat):

| Field | Value |
|-------|--------|
| Email | `patient-demo@deepdose.org` |
| Password | `DemoPatient!2026` |

---

## 3. Pre-demo smoke test (10 min)

Sign in as clinician and confirm:

- [ ] `/clinical/dashboard` — **Your patients** shows 3 rows; Maya sorts first (device alert)
- [ ] **Active kits** / **Program** tiles render (TipTraQ section)
- [ ] **Link patients** — invite code generates without error
- [ ] Open **Maya Okonkwo** chart → Overview loads TipTraQ + prescriptions
- [ ] **Medications** tab — prescribing form submits (no API error)
- [ ] **Circadian** tab — CHI gauge + dosing clock (if score > 0 on patient)
- [ ] **History** tab — recommendations / adherence lists (may be empty on panel-only seed)

If triage is empty: re-run `seed-clinician-demo.mjs`. If still empty while logged in as the demo clinician, ensure migration `20260621000018_clinician_read_linked_consents.sql` is applied (`npx supabase db push --yes`) — without it, linked patients are hidden by RLS.

---

## 4. Demo script (talk track)

| Step | Where | Show |
|------|--------|------|
| 1 | Triage | Alert-first queue, expand patient row, **Open chart** |
| 2 | Overview | TipTraQ kit + readings; active prescriptions with BTI status |
| 3 | Medications | Collapsible med rows; **Propose timing change** |
| 4 | Circadian | CHI alignment + 24h dosing windows |
| 5 | History | Past recommendations + adherence log |
| 6 | Triage → Link patients | Generate invite code |
| 7 | (Optional) Patient profile | Care & consent → enter invite code → patient accepts clinician rec on dash |

**Framing line:** “Decision support for timing — not prescribing doses. Patient accepts changes on their app.”

---

## 5. Known gaps (set expectations)

- No clinician self-signup — demo account only (or manual `tier: clinician` in Supabase)
- `/clinical/dashboard/insights` — not built (not in nav)
- Real patients need onboarding, consent, and invite link before they appear in triage
- Use synthetic demo accounts only on shared Supabase projects

---

## 6. Day-of checklist

- [ ] Re-run clinician seed if database was reset
- [ ] Incognito window + clinician credentials ready (don’t autofill wrong account)
- [ ] Second browser/tab logged in as `patient-demo@deepdose.org` if showing accept/decline
- [ ] Stable network; Supabase project not paused
- [ ] Have rollback story: “This is a preview build” if something 500s

---

## Quick commands reference

```powershell
cd deepdose
npm run build
npx supabase db push --yes
node --env-file=.env.local scripts/seed-clinician-demo.mjs
node --env-file=.env.local scripts/seed-patient-demo.mjs
node --env-file=.env.local scripts/smoke-clinical-loop.mjs
node --env-file=.env.local scripts/smoke-clinical-tiptraq.mjs
node scripts/check-supabase.mjs
node scripts/deploy.mjs
```
