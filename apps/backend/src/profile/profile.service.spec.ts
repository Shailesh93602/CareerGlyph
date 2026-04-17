import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from '../database/prisma.service';

// Mock developer matching the exact Prisma include shape used by the service
const mockDeveloper = {
  id: 'dev-1',
  username: 'shailesh',
  name: 'Shailesh Chaudhari',
  bio: 'Software Engineer',
  avatarUrl: null,
  location: 'Gujarat, India',
  websiteUrl: null,
  githubLogin: 'shailesh93602',
  linkedinUrl: null,
  isPublic: true,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  skills: [
    {
      id: 'skill-1',
      name: 'TypeScript',
      category: 'LANGUAGE',
      level: 'ADVANCED',
      yearsExp: 3,
      developerId: 'dev-1',
      endorsements: [
        {
          id: 'end-1',
          skillId: 'skill-1',
          giverId: 'user-2',
          receiverId: 'dev-1',
          message: 'Great TypeScript skills',
          createdAt: new Date('2024-02-01T00:00:00Z'),
          giver: { username: 'giver1', name: 'Giver One', avatarUrl: null },
        },
      ],
    },
    {
      id: 'skill-2',
      name: 'React',
      category: 'FRONTEND',
      level: 'ADVANCED',
      yearsExp: 2,
      developerId: 'dev-1',
      endorsements: [],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'EduScale',
      description: 'Real-time learning platform',
      techStack: ['Next.js', 'Redis', 'Socket.io'],
      liveUrl: 'https://eduscale.vercel.app',
      githubUrl: 'https://github.com/example/eduscale',
      isHighlight: true,
      startedAt: new Date('2023-06-01T00:00:00Z'),
      endedAt: null,
      developerId: 'dev-1',
    },
  ],
};

describe('ProfileService', () => {
  let service: ProfileService;
  let prismaMock: { developer: { findUnique: jest.Mock } };

  beforeEach(async () => {
    prismaMock = { developer: { findUnique: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── getByUsername ────────────────────────────────────────────────────────

  describe('getByUsername', () => {
    it('returns formatted profile for a public developer', async () => {
      prismaMock.developer.findUnique.mockResolvedValue(mockDeveloper);
      const result = await service.getByUsername('shailesh');
      expect(result).toBeDefined();
      expect(result.username).toBe('shailesh');
      expect(result.name).toBe('Shailesh Chaudhari');
    });

    it('throws NotFoundException when developer is not found', async () => {
      prismaMock.developer.findUnique.mockResolvedValue(null);
      await expect(service.getByUsername('ghost')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException with username in message when not found', async () => {
      prismaMock.developer.findUnique.mockResolvedValue(null);
      await expect(service.getByUsername('ghost')).rejects.toThrow(
        'Developer @ghost not found',
      );
    });

    it('throws NotFoundException when profile is private', async () => {
      prismaMock.developer.findUnique.mockResolvedValue({
        ...mockDeveloper,
        isPublic: false,
      });
      await expect(service.getByUsername('shailesh')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('calls prisma with the correct username', async () => {
      prismaMock.developer.findUnique.mockResolvedValue(mockDeveloper);
      await service.getByUsername('shailesh');
      expect(prismaMock.developer.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { username: 'shailesh' } }),
      );
    });

    it('includes skills and projects in the Prisma query', async () => {
      prismaMock.developer.findUnique.mockResolvedValue(mockDeveloper);
      await service.getByUsername('shailesh');
      const callArg = prismaMock.developer.findUnique.mock.calls[0][0];
      expect(callArg.include).toBeDefined();
      expect(callArg.include.skills).toBeDefined();
      expect(callArg.include.projects).toBeDefined();
    });
  });

  // ─── formatted profile shape ──────────────────────────────────────────────

  describe('formatted profile shape', () => {
    let result: Awaited<ReturnType<ProfileService['getByUsername']>>;

    beforeEach(async () => {
      prismaMock.developer.findUnique.mockResolvedValue(mockDeveloper);
      result = await service.getByUsername('shailesh');
    });

    it('does not expose internal isPublic field', () => {
      expect((result as any).isPublic).toBeUndefined();
    });

    it('does not expose internal id field', () => {
      expect((result as any).id).toBeUndefined();
    });

    it('maps createdAt to memberSince', () => {
      expect(result.memberSince).toEqual(mockDeveloper.createdAt);
    });

    it('maps skills with endorsementCount', () => {
      const ts = result.skills.find((s) => s.name === 'TypeScript');
      expect(ts?.endorsementCount).toBe(1);
    });

    it('sets endorsementCount to 0 for skills with no endorsements', () => {
      const react = result.skills.find((s) => s.name === 'React');
      expect(react?.endorsementCount).toBe(0);
    });

    it('maps endorsedBy array per skill', () => {
      const ts = result.skills.find((s) => s.name === 'TypeScript');
      expect(ts?.endorsedBy).toHaveLength(1);
      expect(ts?.endorsedBy[0].username).toBe('giver1');
      expect(ts?.endorsedBy[0].message).toBe('Great TypeScript skills');
    });

    it('endorsedBy is empty array for skills with no endorsements', () => {
      const react = result.skills.find((s) => s.name === 'React');
      expect(react?.endorsedBy).toEqual([]);
    });

    it('maps project fields including isHighlight', () => {
      expect(result.projects[0].isHighlight).toBe(true);
      expect(result.projects[0].title).toBe('EduScale');
      expect(result.projects[0].techStack).toContain('Redis');
    });
  });

  // ─── getHealth ────────────────────────────────────────────────────────────

  describe('getHealth', () => {
    it('returns a non-empty string', () => {
      const result = service.getHealth();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns the expected health message', () => {
      expect(service.getHealth()).toBe('Profile service is running');
    });
  });
});
