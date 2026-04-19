import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

const mockProfile = {
  username: 'shailesh',
  name: 'Shailesh Chaudhari',
  bio: null,
  avatarUrl: null,
  location: 'Gujarat, India',
  websiteUrl: null,
  githubLogin: 'shailesh93602',
  linkedinUrl: null,
  memberSince: new Date('2024-01-01T00:00:00Z'),
  skills: [],
  projects: [],
};

const fakeReq = (id: string) => ({ user: { id } });

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  beforeEach(async () => {
    const serviceMock = {
      getByUsername: jest.fn(),
      getHealth: jest.fn(),
      updateProfile: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      addProject: jest.fn(),
      removeProject: jest.fn(),
      endorseSkill: jest.fn(),
      removeEndorsement: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─── getProfile ───────────────────────────────────────────────────────────

  describe('getProfile', () => {
    it('delegates to profileService.getByUsername', async () => {
      service.getByUsername.mockResolvedValue(mockProfile as any);
      const result = await controller.getProfile('shailesh');
      expect(service.getByUsername).toHaveBeenCalledWith('shailesh');
      expect(result).toEqual(mockProfile);
    });

    it('passes the username param unchanged to the service', async () => {
      service.getByUsername.mockResolvedValue(mockProfile as any);
      await controller.getProfile('another-user');
      expect(service.getByUsername).toHaveBeenCalledWith('another-user');
    });

    it('propagates NotFoundException from service', async () => {
      service.getByUsername.mockRejectedValue(
        new NotFoundException('Developer @unknown not found')
      );
      await expect(controller.getProfile('unknown')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  // ─── getHealth ────────────────────────────────────────────────────────────

  describe('getHealth', () => {
    it('delegates to profileService.getHealth', () => {
      service.getHealth.mockReturnValue('Profile service is running');
      const result = controller.getHealth();
      expect(service.getHealth).toHaveBeenCalledTimes(1);
      expect(result).toBe('Profile service is running');
    });
  });

  // ─── updateProfile ────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('calls service.updateProfile with the authenticated user id and dto', async () => {
      const dto = { name: 'Updated Name', bio: 'Updated bio' };
      service.updateProfile.mockResolvedValue(mockProfile as any);
      const result = await controller.updateProfile(
        fakeReq('dev-1') as any,
        dto as any
      );
      expect(service.updateProfile).toHaveBeenCalledWith('dev-1', dto);
      expect(result).toEqual(mockProfile);
    });

    it('propagates NotFoundException when developer is not found', async () => {
      service.updateProfile.mockRejectedValue(
        new NotFoundException('Developer not found')
      );
      await expect(
        controller.updateProfile(fakeReq('dev-1') as any, {} as any)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── addSkill ─────────────────────────────────────────────────────────────

  describe('addSkill', () => {
    it('calls service.addSkill with user id and dto', async () => {
      const dto = {
        name: 'Redis',
        category: 'DATABASE' as any,
        level: 'ADVANCED' as any,
      };
      const created = {
        id: 'skill-new',
        ...dto,
        developerId: 'dev-1',
        yearsExp: null,
      };
      service.addSkill.mockResolvedValue(created as any);

      const result = await controller.addSkill(fakeReq('dev-1') as any, dto);
      expect(service.addSkill).toHaveBeenCalledWith('dev-1', dto);
      expect(result).toEqual(created);
    });
  });

  // ─── removeSkill ──────────────────────────────────────────────────────────

  describe('removeSkill', () => {
    it('calls service.removeSkill with user id and skillId', async () => {
      service.removeSkill.mockResolvedValue(undefined);
      await controller.removeSkill(fakeReq('dev-1') as any, 'skill-1');
      expect(service.removeSkill).toHaveBeenCalledWith('dev-1', 'skill-1');
    });

    it('propagates NotFoundException from service', async () => {
      service.removeSkill.mockRejectedValue(
        new NotFoundException('Skill not found')
      );
      await expect(
        controller.removeSkill(fakeReq('dev-1') as any, 'ghost-skill')
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── addProject ───────────────────────────────────────────────────────────

  describe('addProject', () => {
    it('calls service.addProject with user id and dto', async () => {
      const dto = {
        title: 'EduScale',
        description: 'Real-time platform',
        techStack: ['NestJS'],
      };
      const created = {
        id: 'proj-new',
        ...dto,
        developerId: 'dev-1',
        isHighlight: false,
      };
      service.addProject.mockResolvedValue(created as any);

      const result = await controller.addProject(
        fakeReq('dev-1') as any,
        dto as any
      );
      expect(service.addProject).toHaveBeenCalledWith('dev-1', dto);
      expect(result).toEqual(created);
    });
  });

  // ─── removeProject ────────────────────────────────────────────────────────

  describe('removeProject', () => {
    it('calls service.removeProject with user id and projectId', async () => {
      service.removeProject.mockResolvedValue(undefined);
      await controller.removeProject(fakeReq('dev-1') as any, 'proj-1');
      expect(service.removeProject).toHaveBeenCalledWith('dev-1', 'proj-1');
    });

    it('propagates NotFoundException from service', async () => {
      service.removeProject.mockRejectedValue(
        new NotFoundException('Project not found')
      );
      await expect(
        controller.removeProject(fakeReq('dev-1') as any, 'ghost-proj')
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── endorseSkill ─────────────────────────────────────────────────────────

  describe('endorseSkill', () => {
    it('calls service.endorseSkill with giver id, skillId, and dto', async () => {
      const dto = { message: 'Great TypeScript skills' };
      const upserted = { id: 'end-new', skillId: 'skill-1', giverId: 'dev-1' };
      service.endorseSkill.mockResolvedValue(upserted as any);

      const result = await controller.endorseSkill(
        fakeReq('dev-1') as any,
        'skill-1',
        dto
      );
      expect(service.endorseSkill).toHaveBeenCalledWith(
        'dev-1',
        'skill-1',
        dto
      );
      expect(result).toEqual(upserted);
    });

    it('propagates BadRequestException when endorsing own skill', async () => {
      service.endorseSkill.mockRejectedValue(
        new BadRequestException('Cannot endorse your own skill')
      );
      await expect(
        controller.endorseSkill(fakeReq('dev-1') as any, 'skill-1', {})
      ).rejects.toThrow(BadRequestException);
    });

    it('propagates NotFoundException when skill does not exist', async () => {
      service.endorseSkill.mockRejectedValue(
        new NotFoundException('Skill not found')
      );
      await expect(
        controller.endorseSkill(fakeReq('dev-1') as any, 'ghost-skill', {})
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── removeEndorsement ────────────────────────────────────────────────────

  describe('removeEndorsement', () => {
    it('calls service.removeEndorsement with giver id and skillId', async () => {
      service.removeEndorsement.mockResolvedValue(undefined);
      await controller.removeEndorsement(fakeReq('dev-1') as any, 'skill-1');
      expect(service.removeEndorsement).toHaveBeenCalledWith(
        'dev-1',
        'skill-1'
      );
    });

    it('propagates NotFoundException when endorsement does not exist', async () => {
      service.removeEndorsement.mockRejectedValue(
        new NotFoundException('Endorsement not found')
      );
      await expect(
        controller.removeEndorsement(fakeReq('dev-1') as any, 'ghost-skill')
      ).rejects.toThrow(NotFoundException);
    });
  });
});
