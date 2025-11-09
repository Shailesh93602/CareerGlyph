# Backend Documentation

## Overview
The backend is built with NestJS, providing a robust API for the CareerGlyph platform. It handles authentication, profile management, AI integrations, and external service integrations.

## Architecture

### Directory Structure
```
apps/backend/
├── src/
│   ├── auth/               # Authentication module
│   ├── profile/            # Profile management
│   ├── project/            # Project and repository management
│   ├── ai/                 # AI-powered features
│   ├── integrations/       # External service integrations
│   ├── common/             # Shared utilities and decorators
│   └── database/           # Database configurations
├── prisma/                 # Prisma schema and migrations
├── test/                   # Test files
└── dist/                   # Compiled output
```

### Key Features
- **RESTful API**: Well-structured endpoints with OpenAPI documentation
- **Authentication**: JWT-based auth with OAuth providers
- **Database**: PostgreSQL with Prisma ORM + MongoDB for analytics
- **Background Jobs**: Bull/Redis for async processing
- **File Storage**: AWS S3 integration
- **Rate Limiting**: API rate limiting and security
- **Real-time**: WebSocket support for notifications

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **View API documentation:**
   Visit `http://localhost:3001/api/docs`

## Modules

### Authentication Module
- JWT token management
- OAuth integration (GitHub, LinkedIn)
- Password hashing and validation
- Email verification

### Profile Module
- User profile CRUD operations
- Skill management and verification
- Profile health scoring
- Public profile generation

### Project Module
- GitHub repository sync
- Project showcase management
- Code snippet extraction
- Technology stack analysis

### AI Module
- OpenAI GPT integration
- Profile summary generation
- Skill analysis and recommendations
- Job matching algorithms

### Integrations Module
- GitHub API integration
- LinkedIn API integration
- StackOverflow API integration
- Email service integration

## Database Schema

### Main Entities
- **User**: Core user information and authentication
- **Profile**: Public profile data and settings
- **Project**: Project information and metadata
- **Skill**: Skills with verification status
- **Experience**: Work experience entries
- **Education**: Educational background

### Relationships
```
User (1:1) Profile
Profile (1:*) Project
Profile (1:*) Skill
Profile (1:*) Experience
Profile (1:*) Education
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/github` - GitHub OAuth
- `GET /auth/linkedin` - LinkedIn OAuth

### Profile
- `GET /profile/me` - Get current user profile
- `PUT /profile/update` - Update profile
- `GET /profile/public/:slug` - Get public profile

### Projects
- `GET /project` - List user projects
- `POST /project/sync/github` - Sync GitHub repositories
- `PUT /project/:id/featured` - Toggle featured status

## Development Guidelines

### Module Structure
```typescript
@Module({
  imports: [/* module dependencies */],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
```

### Service Pattern
```typescript
@Injectable()
export class ModuleService {
  constructor(
    private readonly prisma: PrismaService,
    // other dependencies
  ) {}

  async findOne(id: string): Promise<Entity> {
    // service logic
  }
}
```

### Controller Pattern
```typescript
@Controller('module')
@ApiTags('module')
export class ModuleController {
  constructor(private readonly service: ModuleService) {}

  @Get(':id')
  @ApiResponse({ type: EntityDto })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
```

### Error Handling
- Use NestJS built-in exception filters
- Implement custom exceptions for business logic
- Log errors appropriately for debugging

### Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for critical user flows