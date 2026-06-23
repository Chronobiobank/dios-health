# dios-health

Monorepo for **[DeepDose](https://deepdose.org)** — precision chronotherapy and dosing decision support.

## Active application

All development, deploy, and Supabase work happens in **`deepdose/`**:

```powershell
cd deepdose
pnpm install
pnpm dev
```

| Resource | Location |
|----------|----------|
| App source | `deepdose/src/` |
| Supabase migrations | `deepdose/supabase/migrations/` |
| Production deploy | `deepdose/DEPLOY.md` |
| Architecture rules | `CLAUDE.md` |

**Supabase project:** DeepDose (`yavqgklsfmawhrqvuvuf`)  
**Vercel project:** `circadian-foundation/deepdose`

```powershell
cd deepdose
node scripts/deploy.mjs              # full production deploy
node scripts/check-supabase.mjs      # verify env + project ref
npx supabase db advisors --linked    # security lint after schema changes
```

Legacy DIOS / Cloq / Secopeutic prototype code at the repo root was removed — only DeepDose is maintained.
