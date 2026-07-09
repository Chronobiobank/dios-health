# DeepDose — Vercel deploy checklist

Production app lives in **`deepdose/`** inside the `dios-health` GitHub repo. Legacy root prototype apps and Supabase projects are retired.

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
| `NEXT_PUBLIC_APP_URL` | `https://www.unmed.net` (brand: Deepdose; flip to `https://www.deepdose.org` when that domain is primary) |
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

- [ ] **Site URL:** `https://www.unmed.net` (or `https://www.deepdose.org` once primary)
- [ ] **Redirect URLs:**  
  `https://www.unmed.net/auth/callback`  
  `https://unmed.net/auth/callback`  
  `https://www.deepdose.org/auth/callback`  
  `https://deepdose.org/auth/callback`  
  `https://*.vercel.app/auth/callback`

## 4. Database

- [ ] Apply migrations: `npx supabase db push --yes` (from `deepdose/`)
- [ ] Security lint: `npx supabase db advisors --linked` — zero `rls_disabled_in_public` errors before production deploy

## 5. Domain

- [x] `unmed.net` + `www.unmed.net` on [Vercel deepdose project](https://vercel.com/circadian-foundation/deepdose/settings/domains) — live host; product brand is Deepdose
- [x] `deepdose.org` / `www.deepdose.org` redirect to `www.unmed.net` until Deepdose domain is promoted primary
- [x] Legacy domains (`dios.health`, `secopeutic.com`) redirect to `www.unmed.net` via `deepdose/vercel.json`

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
npx supabase db advisors --linked
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
