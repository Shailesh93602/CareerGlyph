import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSkillDto } from './dto/create-skill.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { EndorseSkillDto } from './dto/endorse-skill.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUsername(username: string) {
    const developer = await this.prisma.developer.findUnique({
      where: { username },
      include: {
        skills: {
          include: {
            endorsements: {
              include: {
                giver: {
                  select: { username: true, name: true, avatarUrl: true },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: [{ level: 'desc' }, { name: 'asc' }],
        },
        projects: {
          orderBy: [{ isHighlight: 'desc' }, { startedAt: 'desc' }],
        },
      },
    });

    if (!developer?.isPublic) {
      throw new NotFoundException(`Developer @${username} not found`);
    }

    return this.formatProfile(developer);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    await this.prisma.developer.update({ where: { id }, data: dto });
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            endorsements: {
              include: {
                giver: {
                  select: { username: true, name: true, avatarUrl: true },
                },
              },
            },
          },
        },
        projects: { orderBy: [{ isHighlight: 'desc' }, { startedAt: 'desc' }] },
      },
    });
    if (!developer) throw new NotFoundException(`Developer not found`);
    return this.formatProfile(developer);
  }

  getHealth(): string {
    return 'Profile service is running';
  }

  // ─── Skills ────────────────────────────────────────────────────────────────

  async addSkill(developerId: string, dto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: { ...dto, developerId },
    });
  }

  async removeSkill(developerId: string, skillId: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (skill?.developerId !== developerId) {
      throw new NotFoundException('Skill not found');
    }
    await this.prisma.skill.delete({ where: { id: skillId } });
  }

  // ─── Projects ──────────────────────────────────────────────────────────────

  async addProject(developerId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...dto,
        developerId,
        startedAt: dto.startedAt ? new Date(dto.startedAt) : null,
      },
    });
  }

  async removeProject(developerId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (project?.developerId !== developerId) {
      throw new NotFoundException('Project not found');
    }
    await this.prisma.project.delete({ where: { id: projectId } });
  }

  // ─── Endorsements ──────────────────────────────────────────────────────────

  async endorseSkill(giverId: string, skillId: string, dto: EndorseSkillDto) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) throw new NotFoundException('Skill not found');
    if (skill.developerId === giverId) {
      throw new BadRequestException('Cannot endorse your own skill');
    }

    return this.prisma.endorsement.upsert({
      where: { skillId_giverId: { skillId, giverId } },
      update: { message: dto.message },
      create: {
        skillId,
        giverId,
        receiverId: skill.developerId,
        message: dto.message,
      },
    });
  }

  async removeEndorsement(giverId: string, skillId: string) {
    const endorsement = await this.prisma.endorsement.findUnique({
      where: { skillId_giverId: { skillId, giverId } },
    });
    if (!endorsement) throw new NotFoundException('Endorsement not found');
    await this.prisma.endorsement.delete({
      where: { skillId_giverId: { skillId, giverId } },
    });
  }

  formatProfile(developer: any) {
    return {
      username: developer.username,
      name: developer.name,
      bio: developer.bio,
      avatarUrl: developer.avatarUrl,
      location: developer.location,
      websiteUrl: developer.websiteUrl,
      githubLogin: developer.githubLogin,
      linkedinUrl: developer.linkedinUrl,
      memberSince: developer.createdAt,
      skills: developer.skills.map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        yearsExp: skill.yearsExp,
        endorsementCount: skill.endorsements.length,
        endorsedBy: skill.endorsements.map((e: any) => ({
          username: e.giver.username,
          name: e.giver.name,
          avatarUrl: e.giver.avatarUrl,
          message: e.message,
        })),
      })),
      projects: developer.projects.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        techStack: project.techStack,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        isHighlight: project.isHighlight,
        startedAt: project.startedAt,
        endedAt: project.endedAt,
      })),
    };
  }
}
