# DeepDose — Vercel deploy checklist

Deploy as a **separate Vercel project** from the `dios-health` repo. Do not reuse the dios.health project or root `vercel.json`.

## Already done (this session)

- [x] **Vercel project created:** `circadian-foundation/deepdose`
- [x] **Local link:** `deepdose/.vercel/project.json` → project `deepdose`
- [x] **`vercel.json`** — pnpm build, London region, www redirect
- [x] **Pre-flight build** — `pnpm build` passes
- [x] **Supabase connectivity** — project `yavqgklsfmawhrqvuvuf` (DeepDose), tables + auth healthy
- [x] **Supabase auth URLs** — `npx supabase config push` (site `https://deepdose.org`, Vercel preview callback)
- [x] **Production env vars** — synced to Vercel (9 vars)
- [x] **Production deploy** — live at **https://deepdose.org**

## Run the deploy (one command)

From `deepdose/`:

```powershell
# Optional: Supabase Management API token for auth URL push
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."   # dashboard → Account → Access Tokens

node scripts/deploy.mjs
```

Or step by step:

```powershell
node scripts/deploy.mjs --step env      # .env.local → Vercel (production + preview)
node scripts/deploy.mjs --step auth     # Supabase redirect URLs (needs token)
node scripts/deploy.mjs --step db        # migrations
node scripts/deploy.mjs --step deploy    # vercel --prod
```

---

## 1. Vercel project

- [x] Project `deepdose` under **Circadian Foundation**
- [ ] **Git connect** (optional, for auto-deploy on push):

  ```powershell
  cd deepdose
  vercel git connect https://github.com/Chronobiobank/dios-health.git
  ```

- [ ] **Root Directory:** set to `deepdose` in [Vercel project settings](https://vercel.com/circadian-foundation/deepdose/settings) (required for Git deploys from monorepo)

## 2. Environment variables

Run `node scripts/sync-vercel-env.mjs` or paste from `.env.local.example` in Vercel → Settings → Environment Variables:

| Variable | Production value |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://yavqgklsfmawhrqvuvuf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only |
| `NEXT_PUBLIC_APP_URL` | `https://deepdose.org` |
| `DLMO_PROXY_VERSION` | `v1` |
| `CIRCADIAN_SCORE_VERSION` | `v1` |
| `NEXT_PUBLIC_ENABLE_PATIENT_TIER` | `true` |
| `NEXT_PUBLIC_ENABLE_CLINICAL_TIER` | `true` |
| `NEXT_PUBLIC_ENABLE_ENTERPRISE_TIER` | `false` |

## 3. Supabase auth

Run one of:

```powershell
# A) Management API (recommended)
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
node scripts/update-supabase-auth-urls.mjs

# B) CLI full config push (auth section in config.toml is ready)
npx supabase config push --yes
```

Or manually in Supabase → Authentication → URL configuration:

- [ ] **Site URL:** `https://deepdose.org`
- [ ] **Redirect URLs:**  
  `https://deepdose.org/auth/callback`  
  `https://*.vercel.app/auth/callback`

## 4. Database

- [x] Migrations appear applied (medications, consent_frameworks, user_profiles return 200)
- [ ] Reconcile if needed: `npx supabase db push --yes`

## 5. Domain

- [x] `deepdose.org` on [Vercel deepdose project](https://vercel.com/circadian-foundation/deepdose/settings/domains)
- [x] `www.deepdose.org` → `deepdose.org` redirect in `vercel.json`
- [ ] **Retire legacy domains** — add `dios.health` and `www.dios.health` to the **deepdose** Vercel project (remove from old `dios-health` project if attached). `vercel.json` redirects them to `https://deepdose.org/:path*`.
- [ ] Optional: same for `secopeutic.com` / `www.secopeutic.com` (also in `vercel.json`).
- [ ] After redirects verified, pause/delete the old **dios-health-dev** Supabase project.

## 6. Pre-flight

```powershell
cd deepdose
pnpm install --frozen-lockfile
pnpm build
```

## 7. Post-deploy smoke test

After `vercel --prod` or first Git deploy:

- [ ] `/` — landing page
- [ ] `/login` → auth → `/auth/callback` → onboarding
- [ ] `/patient/dashboard` — redirects when logged out
- [ ] Circadian score + dosing clock with live data

Verify Supabase any time:

```powershell
node scripts/check-supabase.mjs
```

## 8. Google Search Console (auto sitemap on deploy)

Legacy `google.com/ping` is deprecated. Deploys now call the **Search Console API** when a service account is configured.

### One-time setup

1. [Google Cloud Console](https://console.cloud.google.com/) → create/select project → **APIs & Services** → enable **Google Search Console API**
2. **IAM** → **Service Accounts** → create → **Keys** → JSON key download
3. [Search Console](https://search.google.com/search-console) → **Settings** → **Users and permissions** → add the service account email (`...@....iam.gserviceaccount.com`) with **Full** access
4. Note your property URL exactly (URL-prefix is usually `https://deepdose.org/` with trailing slash; domain properties use `sc-domain:deepdose.org`)

### Local env (`deepdose/.env.local`)

```powershell
# Base64-encode the JSON key (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\key.json")) | Set-Clipboard
```

```env
GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64=<paste>
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://deepdose.org/
```

Add the same vars in **Vercel → Settings → Environment Variables** (mark sensitive).

### Run

```powershell
node scripts/submit-google-index.mjs          # submit only
node scripts/deploy.mjs --step index          # after deploy
node scripts/deploy.mjs                       # deploy + auto-submit at end
```

If credentials are missing, the step skips with a warning and deploy still succeeds.
