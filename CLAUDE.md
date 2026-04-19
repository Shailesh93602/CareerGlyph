# CLAUDE.md — CareerGlyph

## Project overview

Developer identity platform replacing static resumes. Public profile viewer at `/[username]` with skill endorsements, project links, and AI-generated insights.

Monorepo layout: `apps/frontend` (Next.js 14) + `apps/backend` (NestJS 10) + `packages/{shared,ui,utils}` + `tools/{eslint-config,tsconfig}`. Uses npm workspaces.

Not yet deployed to production — owner is finishing the frontend flow.

## Stack

- **Frontend:** Next.js 14 App Router, TypeScript, Tailwind, TanStack Query, shadcn/ui, Supabase Auth
- **Backend:** NestJS 10, Prisma + PostgreSQL, JWT auth, `@Global()` DatabaseModule, rate-limited auth endpoints, Swagger
- **Shared:** Prisma schema + generated client, ESLint flat config, tsconfig paths

## Key commands (from monorepo root)

```bash
npm run dev              # runs frontend + backend concurrently
npm run dev:frontend     # port 3000
npm run dev:backend      # port 3001

npm run build            # builds both
npm run build:frontend
npm run build:backend

npm run test             # runs across all workspaces
npm run test:e2e         # frontend Playwright

# Per-app:
cd apps/backend && npm run test           # 71 tests passing
cd apps/backend && npm run type-check
cd apps/frontend && npm run lint
cd apps/frontend && npm run format
```

## Architecture

### Backend (`apps/backend/src/`)

```
auth/                   # JWT strategy, rate-limited login/register, JwtAuthGuard
common/                 # filters, interceptors, decorators
database/               # @Global() Prisma module + PrismaService singleton
integrations/           # External API adapters (if any)
ai/                     # AI-powered profile insights
app.module.ts
main.ts                 # NestJS bootstrap + Swagger mount + CORS
```

Entities: Developer, Skill (compound-unique `[developerId, slug]`), Project, Endorsement (compound-unique `[developerId, skillId, endorserId]` — enables idempotent upsert), User.

### Frontend (`apps/frontend/src/`)

```
app/
  (routes for login, register, /[username] profile viewer, edit-profile)
components/
hooks/
lib/                    # Supabase client, API client, utils
types/
utils/
```

## Environment variables

### Backend
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Signs auth tokens |
| `PORT` | Default 3001 |

### Frontend
| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL |

## Testing

- **Backend:** Jest + supertest, 71 tests covering auth, skills, projects, endorsements, profile reads.
- **Frontend:** Jest (component tests) + Playwright E2E (work-in-progress).
- Root `.eslintrc.js` uses `plugin:@typescript-eslint/recommended` (fixed 2026-04-19 — earlier missing `plugin:` prefix broke lint in both apps).

## Conventions

- Compound-unique keys on many-to-many edges — makes upserts idempotent (pattern reused from EduScale).
- All DB access via `PrismaService` from the `@Global() DatabaseModule`.
- Swagger-annotated endpoints (`@ApiOperation`, `@ApiParam`, `@ApiResponse`).
- Rate limits on auth endpoints (Nest guards).

## Owner context

- Pre-deployment: frontend flows still being completed (edit-profile, optimistic endorsement UX).
- Target: once shipped, feeds the **Supabase** application story (Supabase Auth + Realtime endorsements + RLS policies could be added).
- Not on the critical path for the 3-month plan — work on it as bandwidth allows.

## Related

- Parent portfolio: `/Users/shaileshchaudhari/Desktop/Coding/portfolio_next/CLAUDE.md`
- Portfolio card: `constants/projects.ts` id = `careerglyph`
- TODO §2F: "CareerGlyph frontend completion" — edit-profile page, endorse button optimistic UX, register → edit → endorse E2E.
