# CareerGlyph — Backend

NestJS + Prisma backend for the CareerGlyph developer portfolio platform. Exposes a public profile API designed to demonstrate production-grade patterns for Stripe/Vercel/Supabase-style infrastructure roles.

Stack: NestJS 10, TypeScript 5, Prisma 5, PostgreSQL, Jest, Supertest.

---

## Getting started

```bash
# Install dependencies
npm install

# Set up database (requires DATABASE_URL in .env)
npm run db:migrate
npm run db:seed

# Start development server (http://localhost:3001)
npm run dev

# View OpenAPI docs
open http://localhost:3001/api/docs
```

**Required environment variable:**

```
DATABASE_URL=postgresql://user:password@localhost:5432/careerglyph
```

---

## API endpoints

All routes are prefixed with `/api/v1`.

### Profile

| Method | Path                        | Description                                 |
|--------|-----------------------------|---------------------------------------------|
| GET    | `/api/v1/profile/:username` | Get a public developer profile by username  |
| GET    | `/api/v1/profile/health`    | Profile service liveness check              |

**Example — GET /api/v1/profile/shailesh93602**

```json
{
  "username": "shailesh93602",
  "name": "Shailesh Chaudhari",
  "bio": "Software Engineer",
  "avatarUrl": null,
  "location": "Gujarat, India",
  "websiteUrl": null,
  "githubLogin": "shailesh93602",
  "linkedinUrl": null,
  "memberSince": "2024-01-01T00:00:00.000Z",
  "skills": [
    {
      "id": "skill-1",
      "name": "TypeScript",
      "category": "LANGUAGE",
      "level": "ADVANCED",
      "yearsExp": 3,
      "endorsementCount": 2,
      "endorsedBy": [
        { "username": "alice", "name": "Alice", "avatarUrl": null, "message": "Great TS skills" }
      ]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "EduScale",
      "description": "Real-time learning platform",
      "techStack": ["Next.js", "Redis", "Socket.io"],
      "githubUrl": "https://github.com/example/eduscale",
      "liveUrl": "https://eduscale.vercel.app",
      "isHighlight": true,
      "startedAt": "2023-06-01T00:00:00.000Z",
      "endedAt": null
    }
  ]
}
```

Returns `404` when the developer does not exist or `isPublic` is `false`.

### Auth

| Method | Path                    | Description                   |
|--------|-------------------------|-------------------------------|
| GET    | `/api/v1/auth/health`   | Auth service liveness check   |

---

## Running tests

```bash
# Unit tests (30 tests across 5 suites)
npm test

# Unit tests in watch mode
npm run test:watch

# Unit tests with coverage
npm run test:cov

# E2E integration tests (7 tests — no database required, Prisma is mocked)
npm run test:e2e
```

### Test structure

| File | Suite | Count |
|------|-------|-------|
| `src/database/prisma.service.spec.ts` | PrismaService | 3 |
| `src/auth/auth.service.spec.ts` | AuthService | 3 |
| `src/auth/auth.controller.spec.ts` | AuthController | 2 |
| `src/profile/profile.service.spec.ts` | ProfileService | 20 |
| `src/profile/profile.controller.spec.ts` | ProfileController | 5 |
| `test/app.e2e-spec.ts` | App (e2e) | 7 |

The E2E suite spins up a slim `TestAppModule` (no Redis, MongoDB, or AWS) and overrides `PrismaService` with an in-memory mock — no external services needed.

---

## Prisma schema

```
Developer  — username, email, name, bio, avatarUrl, location, githubLogin, linkedinUrl, isPublic
  └── Skill[]       — name, category (LANGUAGE|FRAMEWORK|DATABASE|TOOL|CLOUD|OTHER), level, yearsExp
        └── Endorsement[]  — giver, receiver, message
  └── Project[]     — title, description, techStack[], githubUrl, liveUrl, isHighlight, startedAt, endedAt
```

The public profile response computes `endorsementCount` (length of the endorsements array) per skill and strips internal fields (`id`, `isPublic`, `createdAt`, `updatedAt`). `createdAt` is re-exposed as `memberSince`.

---

## Other commands

```bash
npm run build        # Compile TypeScript via NestJS CLI
npm run typecheck    # tsc --noEmit (type-check only)
npm run lint         # ESLint
npm run format       # Prettier

npm run db:generate  # Regenerate Prisma client after schema changes
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Drop and re-migrate (destructive)
```
