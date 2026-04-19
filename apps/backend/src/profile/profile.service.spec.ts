import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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
  let prismaMock: {
    developer: { findUnique: jest.Mock; update: jest.Mock };
    skill: { create: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };
    project: { create: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };
    endorsement: { upsert: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };
  };

  beforeEach(async () => {
    prismaMock = {
      developer: { findUnique: jest.fn(), update: jest.fn() },
      skill: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
      project: { create: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
      endorsement: { upsert: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
    };

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

  // ─── skills ──────────────────────────────────────────────────────────────

  describe('addSkill', () => {
    it('calls prisma.skill.create with developerId and dto fields', async () => {
      const dto = { name: 'Redis', category: 'DATABASE' as any, level: 'ADVANCED' as any };
      const created = { id: 'skill-new', ...dto, developerId: 'dev-1', yearsExp: null };
      prismaMock.skill.create.mockResolvedValue(created);

      const result = await service.addSkill('dev-1', dto);
      expect(prismaMock.skill.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'Redis', developerId: 'dev-1' }),
      });
      expect(result.id).toBe('skill-new');
    });
  });

  describe('removeSkill', () => {
    it('throws NotFoundException when skill does not belong to developer', async () => {
      prismaMock.skill.findUnique.mockResolvedValue({
        id: 'skill-1',
        developerId: 'other-dev',
      });
      await expect(service.removeSkill('dev-1', 'skill-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException when skill does not exist', async () => {
      prismaMock.skill.findUnique.mockResolvedValue(null);
      await expect(service.removeSkill('dev-1', 'ghost-skill')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deletes the skill when it belongs to the developer', async () => {
      prismaMock.skill.findUnique.mockResolvedValue({ id: 'skill-1', developerId: 'dev-1' });
      prismaMock.skill.delete.mockResolvedValue({});
      await service.removeSkill('dev-1', 'skill-1');
      expect(prismaMock.skill.delete).toHaveBeenCalledWith({ where: { id: 'skill-1' } });
    });
  });

  // ─── projects ────────────────────────────────────────────────────────────

  describe('addProject', () => {
    it('calls prisma.project.create with correct data', async () => {
      const dto = {
        title: 'EduScale',
        description: 'Real-time platform',
        techStack: ['NestJS', 'Redis'],
      };
      const created = { id: 'proj-new', ...dto, developerId: 'dev-1', isHighlight: false, startedAt: null };
      prismaMock.project.create.mockResolvedValue(created);

      const result = await service.addProject('dev-1', dto as any);
      expect(prismaMock.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'EduScale', developerId: 'dev-1' }),
      });
      expect(result.id).toBe('proj-new');
    });
  });

  describe('removeProject', () => {
    it('throws NotFoundException when project does not belong to developer', async () => {
      prismaMock.project.findUnique.mockResolvedValue({
        id: 'proj-1',
        developerId: 'other-dev',
      });
      await expect(service.removeProject('dev-1', 'proj-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── endorsements ────────────────────────────────────────────────────────

  describe('endorseSkill', () => {
    it('throws BadRequestException when developer tries to endorse own skill', async () => {
      prismaMock.skill.findUnique.mockResolvedValue({
        id: 'skill-1',
        developerId: 'dev-1', // same as giverId
      });
      await expect(
        service.endorseSkill('dev-1', 'skill-1', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when skill does not exist', async () => {
      prismaMock.skill.findUnique.mockResolvedValue(null);
      await expect(
        service.endorseSkill('dev-1', 'ghost-skill', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('calls prisma.endorsement.upsert on valid endorsement', async () => {
      prismaMock.skill.findUnique.mockResolvedValue({
        id: 'skill-1',
        developerId: 'other-dev',
      });
      const upserted = { id: 'end-new', skillId: 'skill-1', giverId: 'dev-1' };
      prismaMock.endorsement.upsert.mockResolvedValue(upserted);

      const result = await service.endorseSkill('dev-1', 'skill-1', { message: 'Great skill' });
      expect(prismaMock.endorsement.upsert).toHaveBeenCalled();
      expect(result.id).toBe('end-new');
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
