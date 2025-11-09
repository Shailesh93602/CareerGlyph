# CareerGlyph 🧩

**"Your skills, projects, and impact — not just a PDF."**

CareerGlyph is a dynamic, verifiable, interactive developer profile platform that replaces static resumes with living portfolios powered by verified data, AI summaries, and rich project previews.

## 🎯 What We're Building

### The Problem
- Traditional resumes fail to reflect actual ability or projects
- LinkedIn profiles stay outdated and lack verification
- Recruiters waste hours screening vague descriptions
- No way to showcase real code, style, or practical skills

### The Solution
A living developer profile that provides:
- **AI-summarized overview** of strengths and skills
- **Live verified data** from GitHub, LinkedIn, StackOverflow
- **Project galleries** showcasing real code and results
- **Recruiter insights** with AI-powered fit analysis

## 🏗️ Architecture

### Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, Framer Motion | Interactive profile dashboard |
| **Backend** | NestJS, REST + WebSocket | Profile management, sync jobs, analytics |
| **Database** | PostgreSQL + MongoDB | Structured data + project metadata |
| **AI Layer** | OpenAI GPT-4 / Claude 3 | Profile summaries, skill analysis, fit scoring |
| **Integrations** | GitHub API, LinkedIn API, StackOverflow API | Data imports and verification |
| **Auth** | NextAuth.js | Secure authentication |
| **Storage** | AWS S3 | Profile images and assets |
| **Jobs** | BullMQ | Background tasks and weekly updates |

### Monorepo Structure
```
CareerGlyph/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # NestJS API server
├── packages/
│   ├── shared/            # Shared TypeScript types
│   ├── ui/                # Shared UI components
│   └── utils/             # Common utilities
├── tools/
│   ├── eslint-config/     # Shared ESLint configuration
│   └── tsconfig/          # Shared TypeScript configuration
└── docs/                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- PostgreSQL and MongoDB (or use Docker)
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Shailesh93602/CareerGlyph.git
cd CareerGlyph
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your API keys and database URLs
```

3. **Start development services:**
```bash
# Start databases (Docker)
docker-compose up -d

# Start development servers
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/docs

## 🛠️ Development

### Available Scripts
```bash
# Development
npm run dev              # Start all services in development
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build all applications
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run end-to-end tests

# Linting & Formatting
npm run lint             # Lint all packages
npm run format           # Format code with Prettier
npm run typecheck        # TypeScript type checking
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Reset database
npm run db:reset
```

## 🧩 Core Features

### Phase 1: Core Profile Builder (3 weeks)
- [x] User authentication and onboarding
- [x] Manual project addition and editing
- [x] Basic profile creation and management
- [ ] Profile customization and themes

### Phase 2: API Integrations (2 weeks)
- [ ] GitHub repository sync and analysis
- [ ] LinkedIn profile import
- [ ] AI-powered profile summary generation
- [ ] Automated skill detection and classification

### Phase 3: Recruiter View (2 weeks)
- [ ] Public profile pages with custom URLs
- [ ] AI-powered candidate-job fit scoring
- [ ] Recruiter dashboard and insights
- [ ] Profile sharing and analytics

### Phase 4: AI Enhancements (2 weeks)
- [ ] Advanced AI profile optimization
- [ ] Real-time activity tracking
- [ ] Profile health scoring
- [ ] Personalized recommendations

### Phase 5: Deployment & Polish (1 week)
- [ ] Production deployment pipeline
- [ ] Performance optimization
- [ ] Security hardening
- [ ] User feedback integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Use conventional commits for clear history

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Frontend Setup](./apps/frontend/README.md)
- [Backend Setup](./apps/backend/README.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

## 🔮 Roadmap

### Stretch Features
- Team collaboration profiles
- Verified skill badges through testing
- Recruiter workspace for candidate tracking
- Chrome extension for profile enhancement
- AI-powered cover letter generation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- GitHub for API access
- The open-source community for incredible tools

---

**Built with ❤️ for developers who want to showcase their real impact**
