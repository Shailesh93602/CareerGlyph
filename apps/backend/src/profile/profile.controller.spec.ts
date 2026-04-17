import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
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

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  beforeEach(async () => {
    const serviceMock = {
      getByUsername: jest.fn(),
      getHealth: jest.fn(),
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
        new NotFoundException('Developer @unknown not found'),
      );
      await expect(controller.getProfile('unknown')).rejects.toThrow(
        NotFoundException,
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
});
