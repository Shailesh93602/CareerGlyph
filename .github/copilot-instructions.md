# CareerGlyph - AI Coding Assistant Instructions

## Project Overview
CareerGlyph is a dynamic developer profile platform that replaces static resumes with AI-powered, verifiable, interactive profiles. Built as a full-stack TypeScript monorepo using Next.js and NestJS.

## Architecture & Structure

### Monorepo Layout
```
CareerGlyph/
├── apps/
│   ├── frontend/          # Next.js 14 app (TypeScript, Tailwind)
│   └── backend/           # NestJS API (PostgreSQL, MongoDB, Redis)
├── packages/
│   ├── shared/            # Shared TypeScript types and enums
│   ├── ui/                # Shared UI components library
│   └── utils/             # Common utilities
├── tools/
│   ├── eslint-config/     # Shared ESLint configuration
│   └── tsconfig/          # TypeScript configuration presets
└── scripts/               # Setup and deployment scripts
```

### Tech Stack Implementation
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, NextAuth.js
- **Backend**: NestJS, Prisma (PostgreSQL), Mongoose (MongoDB), Bull/Redis, OpenAI API
- **Shared**: Workspace-based monorepo with shared types and utilities
- **Development**: Docker Compose for databases, comprehensive ESLint/Prettier setup

## Development Guidelines

### Core Domain Entities
Reference `packages/shared/src/types/index.ts` for the complete type system:
- **User & Profile**: Authentication and public profile management
- **Projects**: GitHub integration with AI-generated summaries and code snippets
- **Skills**: Categorized skills with verification and market demand analysis
- **Integrations**: GitHub, LinkedIn, StackOverflow API connections
- **AI Features**: Profile optimization, job matching, career suggestions

### Workspace Commands
```bash
# Development
npm run dev                    # Start all services
npm run dev:frontend          # Frontend only (localhost:3000)
npm run dev:backend           # Backend only (localhost:3001)

# Database Management
npm run db:migrate            # Run Prisma migrations
npm run db:seed              # Seed development data
docker-compose up -d         # Start PostgreSQL, MongoDB, Redis

# Code Quality
npm run lint                 # ESLint across all packages
npm run format              # Prettier formatting
npm run typecheck           # TypeScript validation
```

### Key Patterns

#### Shared Types Usage
```typescript
// Import from shared package in any app
import { User, Profile, SkillCategory } from '@careerglyph/shared';

// All enums and constants are centralized
import { API_ROUTES, SKILL_CATEGORIES } from '@careerglyph/shared';
```

#### Frontend Structure
- App Router with TypeScript: `apps/frontend/src/app/`
- Shared components: `apps/frontend/src/components/`
- React Query for API state management
- NextAuth.js for authentication with GitHub/LinkedIn OAuth

#### Backend Structure
- NestJS modules: `apps/backend/src/{auth,profile,project,ai,integrations}/`
- Prisma for PostgreSQL (structured data)
- Mongoose for MongoDB (analytics/metadata)
- OpenAI integration in `ai/` module
- Bull queues for background jobs (GitHub sync, AI processing)

### Database Strategy
- **PostgreSQL (Prisma)**: Users, profiles, projects, skills, experiences
- **MongoDB (Mongoose)**: Analytics, logs, AI processing results, temporary data
- **Redis**: Session storage, job queues, caching

### External Integrations
- **GitHub API**: Repository sync, commit analysis, language detection
- **LinkedIn API**: Profile import, experience sync
- **OpenAI API**: Profile summaries, skill analysis, job matching
- **AWS S3**: File uploads (avatars, project images, resumes)

### AI Workflow
1. Data collection from GitHub/LinkedIn APIs
2. AI analysis using OpenAI GPT-4 (see `packages/shared/src/constants/index.ts` for prompts)
3. Profile health scoring and optimization suggestions
4. Job matching with fit analysis

### Critical Files & Locations
- **Shared Types**: `packages/shared/src/types/index.ts` - Core domain models
- **API Routes**: `packages/shared/src/constants/index.ts` - Centralized endpoint definitions
- **Environment Config**: `.env.example` - Required API keys and database URLs
- **Database Schema**: `apps/backend/prisma/schema.prisma` - Prisma models
- **Frontend API Client**: Use React Query with shared API_ROUTES constants
- **Backend Modules**: Follow NestJS module pattern in `apps/backend/src/`

### Development Workflow
1. **Setup**: Run `./scripts/setup.sh` for initial environment setup
2. **Feature Development**: Work across monorepo packages as needed
3. **Database Changes**: Update Prisma schema, run migrations, regenerate client
4. **Shared Types**: Update in `packages/shared/` when adding new domain entities
5. **API Development**: Use Swagger docs at `localhost:3001/api/docs`

### Common Tasks
- **Add new API endpoint**: Create in appropriate NestJS module + update API_ROUTES constant
- **Add new UI component**: Create in `apps/frontend/src/components/` or `packages/ui/`
- **Database migration**: Edit schema, run `npm run db:migrate`
- **AI feature**: Implement in `apps/backend/src/ai/` module with OpenAI integration
- **Integration**: Add new service in `apps/backend/src/integrations/`