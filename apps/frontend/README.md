# CareerGlyph Frontend

Next.js 14 frontend for the CareerGlyph developer identity platform.

## Pages

| Route | Description |
|---|---|
| `/` | Landing — hero, feature preview, CTA |
| `/login` | Sign in with email + password |
| `/register` | Create account (username, name, email, password, bio) |
| `/[username]` | Public profile viewer — skills, projects, endorsements |

## Running locally

Requires the CareerGlyph backend running on `:3001`. See `apps/backend/README.md`.

```bash
cd apps/frontend
npm install
cp .env.example .env   # set NEXT_PUBLIC_API_URL
npm run dev            # starts on :3000
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL, e.g. `http://localhost:3001` |

## Key patterns

**Authentication**: JWT stored in `localStorage` (`cg_token`). The axios instance in `src/lib/api.ts` attaches it on every request via an interceptor. On 401, the token is cleared automatically.

**Optimistic endorsements**: `useEndorseSkill` (react-query v3 mutation) updates the endorsement count in the cache before the API call returns. On error, it rolls back to the previous state.

**Profile data**: `useProfile` fetches `GET /api/profile/:username` — public endpoint, no auth required. 5-minute stale time, 1 retry.

## Tech stack

- Next.js 14 (App Router)
- react-query v3
- react-hook-form (built-in rules validation — no yup)
- axios (with request/response interceptors for JWT + 401 handling)
- react-hot-toast
- Tailwind CSS + lucide-react

## Directory structure

```
src/
├── app/
│   ├── [username]/page.tsx   # Public profile viewer
│   ├── login/page.tsx        # Login form
│   ├── register/page.tsx     # Register form
│   ├── layout.tsx            # Root layout
│   └── providers.tsx         # QueryClientProvider + Toaster
├── hooks/
│   └── useProfile.ts         # useProfile, useEndorseSkill, useRemoveEndorsement
├── lib/
│   ├── api.ts                # Axios instance with JWT interceptor
│   └── auth.ts               # localStorage token helpers
└── types/
    └── profile.ts            # Profile, Skill, Project, AuthResponse interfaces
```
