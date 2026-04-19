import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';

const mockDeveloper = {
  id: 'dev-1',
  username: 'shailesh',
  name: 'Shailesh Chaudhari',
  email: 'shailesh@example.com',
  password: 'hashed-password',
  bio: null,
  avatarUrl: null,
  location: null,
  websiteUrl: null,
  githubLogin: null,
  linkedinUrl: null,
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { developer: { findUnique: jest.Mock; create: jest.Mock } };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      developer: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('dev-secret') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getHealth ────────────────────────────────────────────────────────────

  it('getHealth returns a non-empty string', () => {
    const result = service.getHealth();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('getHealth returns expected message', () => {
    expect(service.getHealth()).toBe('Auth service is running');
  });

  // ─── register ─────────────────────────────────────────────────────────────

  describe('register()', () => {
    it('returns accessToken and username for a new email', async () => {
      prisma.developer.findUnique.mockResolvedValue(null);
      prisma.developer.create.mockResolvedValue(mockDeveloper);

      const result = await service.register({
        username: 'shailesh',
        name: 'Shailesh Chaudhari',
        email: 'shailesh@example.com',
        password: 'password123',
      });

      expect(prisma.developer.create).toHaveBeenCalledTimes(1);
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.username).toBe('shailesh');
    });

    it('hashes the password before storing', async () => {
      prisma.developer.findUnique.mockResolvedValue(null);
      prisma.developer.create.mockResolvedValue(mockDeveloper);

      await service.register({
        username: 'shailesh',
        name: 'Shailesh Chaudhari',
        email: 'shailesh@example.com',
        password: 'password123',
      });

      const createCall = prisma.developer.create.mock.calls[0][0];
      expect(createCall.data.password).not.toBe('password123');
      const valid = await bcrypt.compare(
        'password123',
        createCall.data.password
      );
      expect(valid).toBe(true);
    });

    it('throws ConflictException when email already registered', async () => {
      prisma.developer.findUnique.mockResolvedValue(mockDeveloper);

      await expect(
        service.register({
          username: 'other',
          name: 'Other',
          email: 'shailesh@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(ConflictException);

      expect(prisma.developer.create).not.toHaveBeenCalled();
    });
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login()', () => {
    it('returns accessToken for valid credentials', async () => {
      const hash = await bcrypt.hash('password123', 10);
      prisma.developer.findUnique.mockResolvedValue({
        ...mockDeveloper,
        password: hash,
      });

      const result = await service.login({
        email: 'shailesh@example.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.username).toBe('shailesh');
    });

    it('throws UnauthorizedException when email not found', async () => {
      prisma.developer.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nope@example.com', password: 'password123' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct-password', 10);
      prisma.developer.findUnique.mockResolvedValue({
        ...mockDeveloper,
        password: hash,
      });

      await expect(
        service.login({
          email: 'shailesh@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
