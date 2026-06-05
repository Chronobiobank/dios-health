# DIOS Health — greenfield Supabase setup

Use this when you are creating a **brand-new** Supabase project (empty database).  
Keep this file open in Cursor so project names and script titles stay consistent.

---

## Project name registry

Copy these names when creating services. Use the same spelling everywhere.

| What | Official name | Notes |
|------|---------------|--------|
| **Product** | DIOS Health | User-facing brand |
| **Protocol feature** | Retinomic Protocol | Tiered dashboard (photic / metabolic / TipTraQ) |
| **GitHub repository** | `dios-health` | Remote URL ends with `/dios-health` |
| **Local folder** | `dios-health` | Where you run `npm run dev` |
| **npm package** | `dios-health` | In `package.json` |
| **Supabase organisation** | `DIOS Health` | Your Supabase account org (create if needed) |
| **Supabase project (dev)** | `dios-health-dev` | **Create this now** — first empty database |
| **Supabase project (prod, later)** | `dios-health-prod` | Only when you deploy for real users |
| **Supabase region (NZ/AU)** | `Oceania (Sydney)` | Or closest to your users |
| **Database password** | *(you choose)* | Save in a password manager — not in git |
| **Local secrets file** | `.env.local` | Never commit |
| **Secrets template** | `.env.example` | Safe to commit — placeholders only |

### Demo accounts (after seed script)

| Label | Email | Default password | Tier |
|-------|--------|------------------|------|
| Demo Free | `demo-free@dios.health` | `DiosDemo2026!` | `FREE_SCREENING` |
| Demo Premium | `demo-premium@dios.health` | `DiosDemo2026!` | `PREMIUM_VERIFICATION` |

Override emails/password via `DEMO_*` vars in `.env.local`.

### Key app URLs (local)

| Page | Path | Purpose |
|------|------|---------|
| Landing | `/` | Marketing |
| Public demo dashboard | `/how-it-works` | Mock data, no login |
| Sign up | `/auth/signup` | New patient registration |
| Sign in | `/auth/signin` | Login |
| Onboarding | `/onboarding` | Camera + Siloton flow |
| Live dashboard | `/dashboard` | Requires sign-in |

---

## Prerequisites (on your machine)

1. **Cursor** — open folder `dios-health`
2. **Node.js 20+** — `node -v` in terminal
3. **Git** — repo cloned from GitHub
4. Run once: `npm install`

---

## Step 1 — Create Supabase project `dios-health-dev`

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project**
3. Fill in exactly:
   - **Organisation:** `DIOS Health` (or your org)
   - **Project name:** `dios-health-dev`
   - **Database password:** strong password → save it
   - **Region:** `Oceania (Sydney)` (recommended)
4. Wait until status is **Active** (green)

You now have an empty Postgres database plus built-in **Auth** (`auth.users`).

---

## Step 2 — Copy API keys into `.env.local`

1. In Cursor: duplicate `.env.example` → rename to `.env.local`
2. In Supabase: **Project Settings → API** (project `dios-health-dev`)
3. Paste:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SILOTON_WEBHOOK_SECRET=dios-dev-siloton-change-me
TIPTRAQ_WEBHOOK_SECRET=dios-dev-tiptraq-change-me
```

4. Save `.env.local` (git must **not** track this file)

---

## Step 3 — Run all schema migrations (001 → 023)

Greenfield = run **every** file below, **in order**, in Supabase **SQL Editor**.  
For each file: **New query** → paste full contents from Cursor → **Run** → confirm success before the next.

| # | File | Title (what it sets up) |
|---|------|-------------------------|
| 1 | `supabase/migrations/001_auth_dashboard.sql` | Core auth, `profiles`, `patient_profiles`, RLS |
| 2 | `supabase/migrations/002_demo_insights_seed.sql` | Demo insight seed data |
| 3 | `supabase/migrations/003_clinician_onboarding_complete.sql` | Clinician onboarding flags |
| 4 | `supabase/migrations/004_consultation_audit_demo.sql` | Consultation audit tables |
| 5 | `supabase/migrations/005_tiptraq_dlmo.sql` | TipTraQ nights + DLMO fields |
| 6 | `supabase/migrations/006_patient_demographics.sql` | Patient demographic columns |
| 7 | `supabase/migrations/007_clinician_demographics.sql` | Clinician demographic columns |
| 8 | `supabase/migrations/008_profile_avatars.sql` | Profile avatar storage |
| 9 | `supabase/migrations/009_patient_onboarding_terms.sql` | Terms / onboarding consent |
| 10 | `supabase/migrations/010_save_patient_demographics_rpc.sql` | Demographics save RPC |
| 11 | `supabase/migrations/011_profiles_base_columns.sql` | Extra profile columns + role fix |
| 12 | `supabase/migrations/014_current_supplements.sql` | Current supplements |
| 13 | `supabase/migrations/015_mlux_schema.sql` | MLux schema, blood panels, Chronobiobank |
| 14 | `supabase/migrations/016_mel_sessions_domain_note.sql` | MEL sessions note |
| 15 | `supabase/migrations/017_patient_date_of_birth.sql` | Date of birth column |
| 16 | `supabase/migrations/018_complete_patient_signup.sql` | Signup RPC + profile repair |
| 17 | `supabase/migrations/019_fix_auth_signup_trigger.sql` | Auth trigger on new user |
| 18 | `supabase/migrations/020_chronoprofile_onboarding.sql` | Chronoprofile onboarding |
| 19 | `supabase/migrations/021_chronoprofile_date_of_birth.sql` | Chronoprofile DOB RPC |
| 20 | `supabase/migrations/022_retinomic_protocol.sql` | Retinomic tier, webhooks, hardware baseline |
| 21 | `supabase/migrations/023_retinomic_auth_seed.sql` | Siloton integration JSON slot |

**Shortcut (same as 20 + 21):** After 001–019, you may run `supabase/run-retinomic-bootstrap.sql` instead of 022 + 023 separately. It bundles Retinomic + verification queries.

**Do not** run only `run-patient-dashboard-setup.sql` on greenfield — that file is **section 4 only** (migration 021) for fixing an existing project.

### Quick sanity check (SQL Editor)

```sql
select to_regclass('public.patient_profiles') as patient_profiles;
select to_regclass('public.blood_circadian_panels') as blood_panels;
select column_name from information_schema.columns
  where table_name = 'patient_profiles' and column_name = 'retinomic_tier';
```

Expect three rows / one row showing `retinomic_tier`.

---

## Step 4 — Seed demo patients

In Cursor terminal (project root `dios-health`):

```powershell
npm run seed:retinomic-demo
```

Script: `scripts/seed-retinomic-demo.ts`  
Creates `demo-free@dios.health` and `demo-premium@dios.health` in project `dios-health-dev`.

---

## Step 5 — Run the app

```powershell
npm run dev
```

Open [http://localhost:3000/how-it-works](http://localhost:3000/how-it-works) (mock UI), then sign in at `/auth/signin` with a demo account.

---

## Step 6 — GitHub (optional)

Repo name: **`dios-health`**. Commit code changes; never commit `.env.local`.

```powershell
git status
git add .
git commit -m "Your message"
git push
```

---

## Troubleshooting

| Error | Likely cause | Fix |
|-------|--------------|-----|
| `relation "patient_profiles" does not exist` | Migrations not run | Start at `001_auth_dashboard.sql` |
| Signup "Database error" | 018 / 019 not applied | Re-run 018 and 019 |
| Seed: missing service role | `.env.local` incomplete | Re-copy keys from `dios-health-dev` API settings |
| Wrong project | Keys from old Supabase project | Confirm URL matches `dios-health-dev` dashboard |

---

## One-line checklist

```
[ ] Supabase project created: dios-health-dev
[ ] .env.local filled from dios-health-dev API keys
[ ] Migrations 001–023 run in order (or 001–019 + run-retinomic-bootstrap.sql)
[ ] npm run seed:retinomic-demo
[ ] npm run dev → /how-it-works + /auth/signin
```
