import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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
                giver: { select: { username: true, name: true, avatarUrl: true } },
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

    if (!developer || !developer.isPublic) {
      throw new NotFoundException(`Developer @${username} not found`);
    }

    return this.formatProfile(developer);
  }

  getHealth(): string {
    return 'Profile service is running';
  }

  private formatProfile(developer: any) {
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