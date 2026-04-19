/**
 * E2E integration tests using a slim test module that replaces PrismaService
 * with a mock and omits BullModule/AiModule/IntegrationsModule to avoid
 * external service connections (Redis, MongoDB, AWS) during tests.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import request = require('supertest');
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../src/auth/auth.module';
import { ProfileModule } from '../src/profile/profile.module';
import { DatabaseModule } from '../src/database/database.module';
import { PrismaService } from '../src/database/prisma.service';

// ─── Slim test module (no Bull / Mongo / AI / Integrations) ──────────────────

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    ProfileModule,
  ],
})
class TestAppModule {}

// ─── Mock Prisma factory ──────────────────────────────────────────────────────

const buildMockDeveloper = (overrides: Record<string, any> = {}) => ({
  id: 'dev-1',
  username: 'shailesh',
  name: 'Shailesh Chaudhari',
  email: 'shailesh@example.com',
  password: '$2a$10$hashedpasswordplaceholder',
  bio: 'Software Engineer',
  avatarUrl: null,
  location: 'Gujarat, India',
  websiteUrl: null,
  githubLogin: 'shailesh93602',
  linkedinUrl: null,
  isPublic: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  skills: [],
  projects: [],
  ...overrides,
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('App (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    developer: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── GET /api/v1/profile/:username ────────────────────────────────────────

  describe('GET /api/v1/profile/:username', () => {
    it('returns 200 with profile for a public developer', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(buildMockDeveloper());

      return request(app.getHttpServer())
        .get('/api/v1/profile/shailesh')
        .expect(200)
        .expect(res => {
          expect(res.body.username).toBe('shailesh');
          expect(res.body.name).toBe('Shailesh Chaudhari');
        });
    });

    it('strips internal fields from response', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(buildMockDeveloper());

      return request(app.getHttpServer())
        .get('/api/v1/profile/shailesh')
        .expect(200)
        .expect(res => {
          expect(res.body.isPublic).toBeUndefined();
          expect(res.body.id).toBeUndefined();
        });
    });

    it('returns 404 for a private profile', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(
        buildMockDeveloper({ isPublic: false })
      );

      return request(app.getHttpServer())
        .get('/api/v1/profile/shailesh')
        .expect(404);
    });

    it('returns 404 for an unknown username', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get('/api/v1/profile/does-not-exist')
        .expect(404);
    });

    it('returns profile with skills and projects arrays', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(
        buildMockDeveloper({ skills: [], projects: [] })
      );

      return request(app.getHttpServer())
        .get('/api/v1/profile/shailesh')
        .expect(200)
        .expect(res => {
          expect(Array.isArray(res.body.skills)).toBe(true);
          expect(Array.isArray(res.body.projects)).toBe(true);
        });
    });
  });

  // ─── GET /api/v1/auth/health ──────────────────────────────────────────────

  describe('GET /api/v1/auth/health', () => {
    it('returns 200 with health message', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/health')
        .expect(200)
        .expect(res => {
          expect(res.text).toBe('Auth service is running');
        });
    });
  });

  // ─── GET /api/v1/profile/health ───────────────────────────────────────────

  describe('GET /api/v1/profile/health', () => {
    it('returns 200 with profile health message', async () => {
      return request(app.getHttpServer())
        .get('/api/v1/profile/health')
        .expect(200)
        .expect(res => {
          expect(res.text).toBe('Profile service is running');
        });
    });
  });

  // ─── POST /api/v1/auth/register ──────────────────────────────────────────

  describe('POST /api/v1/auth/register', () => {
    it('returns 201 with accessToken on valid registration', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(null); // email not taken
      mockPrisma.developer.create.mockResolvedValue(
        buildMockDeveloper({ email: 'test@example.com', password: 'hashed' })
      );

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201)
        .expect(res => {
          expect(res.body.accessToken).toBeDefined();
          expect(res.body.username).toBe('shailesh');
        });
    });

    it('returns 409 when email already registered', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(
        buildMockDeveloper({ email: 'taken@example.com' })
      );

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'other',
          name: 'Other',
          email: 'taken@example.com',
          password: 'password123',
        })
        .expect(409);
    });

    it('returns 400 when password is too short', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          password: 'short',
        })
        .expect(400);
    });

    it('returns 400 when email is invalid', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          name: 'Test User',
          email: 'not-an-email',
          password: 'password123',
        })
        .expect(400);
    });
  });

  // ─── POST /api/v1/auth/login ──────────────────────────────────────────────

  describe('POST /api/v1/auth/login', () => {
    it('returns 401 for nonexistent email', async () => {
      mockPrisma.developer.findUnique.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nope@example.com', password: 'wrong' })
        .expect(401);
    });

    it('returns 400 for missing fields', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com' })
        .expect(400);
    });
  });
});
