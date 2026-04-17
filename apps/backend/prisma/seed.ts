/**
 * Seed — creates a sample developer profile with skills, projects, and an endorsement.
 * Run: npm run db:seed (from apps/backend)
 */
import { PrismaClient, SkillCategory, SkillLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create two developers so endorsements work
  const shailesh = await prisma.developer.upsert({
    where: { username: 'shailesh93602' },
    update: {},
    create: {
      username: 'shailesh93602',
      email: 'shailesh@example.com',
      name: 'Shailesh Chaudhari',
      bio: 'Full-stack developer specialising in distributed systems and TypeScript.',
      location: 'India',
      websiteUrl: 'https://shaileshchaudhari.vercel.app',
      githubLogin: 'Shailesh93602',
      linkedinUrl: 'https://linkedin.com/in/shailesh-chaudhari-93602',
      isPublic: true,
    },
  });

  const alice = await prisma.developer.upsert({
    where: { username: 'alice_dev' },
    update: {},
    create: {
      username: 'alice_dev',
      email: 'alice@example.com',
      name: 'Alice Eng',
      isPublic: true,
    },
  });

  // Skills
  const nestjsSkill = await prisma.skill.upsert({
    where: { developerId_name: { developerId: shailesh.id, name: 'NestJS' } },
    update: {},
    create: {
      developerId: shailesh.id,
      name: 'NestJS',
      category: SkillCategory.FRAMEWORK,
      level: SkillLevel.ADVANCED,
      yearsExp: 2,
    },
  });

  await prisma.skill.upsert({
    where: { developerId_name: { developerId: shailesh.id, name: 'Redis' } },
    update: {},
    create: {
      developerId: shailesh.id,
      name: 'Redis',
      category: SkillCategory.DATABASE,
      level: SkillLevel.ADVANCED,
      yearsExp: 2,
    },
  });

  await prisma.skill.upsert({
    where: { developerId_name: { developerId: shailesh.id, name: 'TypeScript' } },
    update: {},
    create: {
      developerId: shailesh.id,
      name: 'TypeScript',
      category: SkillCategory.LANGUAGE,
      level: SkillLevel.EXPERT,
      yearsExp: 3,
    },
  });

  // Projects
  await prisma.project.upsert({
    where: { id: 'eduscale-seed-id' },
    update: {},
    create: {
      id: 'eduscale-seed-id',
      developerId: shailesh.id,
      title: 'EduScale',
      description: 'Real-time multiplayer learning platform with distributed session management.',
      techStack: ['NestJS', 'Socket.io', 'Redis', 'PostgreSQL', 'Prometheus'],
      githubUrl: 'https://github.com/Shailesh93602/eduscale',
      isHighlight: true,
      startedAt: new Date('2023-06-01'),
    },
  });

  await prisma.project.upsert({
    where: { id: 'careerglyph-seed-id' },
    update: {},
    create: {
      id: 'careerglyph-seed-id',
      developerId: shailesh.id,
      title: 'CareerGlyph',
      description: 'Dynamic verifiable developer profiles with skill endorsements.',
      techStack: ['NestJS', 'Prisma', 'PostgreSQL', 'Next.js'],
      isHighlight: true,
      startedAt: new Date('2024-01-01'),
    },
  });

  // Endorsement from alice → shailesh on NestJS skill
  await prisma.endorsement.upsert({
    where: { skillId_giverId: { skillId: nestjsSkill.id, giverId: alice.id } },
    update: {},
    create: {
      skillId: nestjsSkill.id,
      receiverId: shailesh.id,
      giverId: alice.id,
      message: 'Built a production-grade NestJS API with Redlock and circuit breakers.',
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
