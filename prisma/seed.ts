import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Seed Users
  const users = [
    {
      firstName: 'Sarah',
      lastName: 'Rahman',
      email: 'sarah@mindunite.org',
      passwordHash,
      headline: 'Cognitive Neuroscientist | Professor at DU | Brain Research lead',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      firstName: 'Rahat',
      lastName: 'Islam',
      email: 'rahat@mindunite.org',
      passwordHash,
      headline: 'Psychology Student at RU | Aspiring Neuro-therapist | Research Intern',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      firstName: 'Fahmida',
      lastName: 'Yeasmin',
      email: 'fahmida@mindunite.org',
      passwordHash,
      headline: 'Clinical Psychologist | Mental Health Counselor & Wellness Coach',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  ];

  console.log('Seeding users...');
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        headline: u.headline,
        avatarUrl: u.avatarUrl,
      },
      create: u,
    });
  }

  // 2. Seed Groups
  const groups = [
    {
      name: 'Figma Product Community',
      category: 'Design & Systems',
      membersCount: 84200,
      avatarUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150',
    },
    {
      name: 'Brain Health Association',
      category: 'Neuroscience',
      membersCount: 12450,
      avatarUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=150',
    },
    {
      name: 'Clinical Psychologists BD',
      category: 'Mental Health',
      membersCount: 5630,
      avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150',
    },
    {
      name: 'Cognitive Science Lab',
      category: 'Research',
      membersCount: 2310,
      avatarUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=150',
    },
  ];

  console.log('Seeding groups...');
  for (const g of groups) {
    const existing = await prisma.group.findFirst({
      where: { name: g.name },
    });
    if (existing) {
      await prisma.group.update({
        where: { id: existing.id },
        data: {
          category: g.category,
          membersCount: g.membersCount,
          avatarUrl: g.avatarUrl,
        },
      });
    } else {
      await prisma.group.create({
        data: g,
      });
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
