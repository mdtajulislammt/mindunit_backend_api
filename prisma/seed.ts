import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Seed Users
  const usersData = [
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
  const seededUsers: any[] = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        firstName: u.firstName,
        lastName: u.lastName,
        headline: u.headline,
        avatarUrl: u.avatarUrl,
      },
      create: u,
    });
    seededUsers.push(user);
  }

  const sarah = seededUsers.find((u) => u.email === 'sarah@mindunite.org');
  const rahat = seededUsers.find((u) => u.email === 'rahat@mindunite.org');
  const fahmida = seededUsers.find((u) => u.email === 'fahmida@mindunite.org');

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

  // 3. Clear Existing Posts (to avoid duplication when re-seeding)
  console.log('Clearing old posts...');
  await prisma.post.deleteMany();

  // 4. Seed 10 Technology Posts with Likes and Comments
  console.log('Seeding 10 technology posts...');
  
  const postsData = [
    {
      content: 'AI in Mental Health: How machine learning models analyze speech patterns and voice inflections to predict early onset cognitive decline and depression.',
      imageUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600',
      privacy: 'PUBLIC',
      authorId: sarah.id,
      likes: [rahat.id, fahmida.id],
      comments: [
        {
          authorId: rahat.id,
          content: "This is a game-changer! Can't wait to see this integrated into clinical diagnostic pipelines.",
          likes: [sarah.id],
          replies: [
            {
              authorId: sarah.id,
              content: 'Absolutely Rahat, early detection is key to slowing progression.',
              likes: [rahat.id],
            },
          ],
        },
      ],
    },
    {
      content: 'Introducing Design Tokens: How unifying colors, typography, and spacing variables streamlines design-to-engineering handoff in large react codebases.',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600',
      privacy: 'PUBLIC',
      authorId: rahat.id,
      likes: [sarah.id, fahmida.id],
      comments: [
        {
          authorId: sarah.id,
          content: 'Great writeup! We should construct a tool that compiles JSON tokens directly to CSS variables.',
          likes: [rahat.id],
          replies: [],
        },
      ],
    },
    {
      content: 'Brain-Computer Interfaces (BCIs) are moving from lab prototypes to real-world applications. We are seeing incredible progress in neural decoders translating motor imagery to text.',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600',
      privacy: 'PUBLIC',
      authorId: sarah.id,
      likes: [rahat.id],
      comments: [
        {
          authorId: rahat.id,
          content: 'Unbelievable progress! The response latency has dropped significantly in recent studies.',
          likes: [sarah.id],
          replies: [],
        },
      ],
    },
    {
      content: 'The Importance of Clean Code in Healthcare Software: Why simple, readable, and highly testable code prevents critical runtime issues in patient care portals.',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      privacy: 'PUBLIC',
      authorId: fahmida.id,
      likes: [sarah.id, rahat.id],
      comments: [
        {
          authorId: sarah.id,
          content: 'Indeed. Implementing typescript strict mode is a great first step to guarantee safety.',
          likes: [fahmida.id],
          replies: [],
        },
      ],
    },
    {
      content: 'Figma AutoLayout v5 Deep Dive: Master nested frames, absolute positions inside auto-layout, and wrap constraints for responsive components.',
      imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600',
      privacy: 'PUBLIC',
      authorId: rahat.id,
      likes: [fahmida.id],
      comments: [
        {
          authorId: fahmida.id,
          content: 'Super useful tips! Autolayout wraps make designing grids so much easier.',
          likes: [rahat.id],
          replies: [],
        },
      ],
    },
    {
      content: 'Quantum Computing and Neural Networks: Exploring theoretical speedups in training deep learning models using quantum qubits.',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
      privacy: 'PUBLIC',
      authorId: sarah.id,
      likes: [rahat.id, fahmida.id],
      comments: [],
    },
    {
      content: 'Mindfulness in the Digital Age: How setting custom boundaries for notifications protects your cognitive focus and bandwidth during sprint tasks.',
      imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600',
      privacy: 'PUBLIC',
      authorId: fahmida.id,
      likes: [sarah.id, rahat.id],
      comments: [
        {
          authorId: rahat.id,
          content: 'I muted non-urgent notifications last week and my coding focus improved immensely.',
          likes: [fahmida.id],
          replies: [],
        },
      ],
    },
    {
      content: 'Deep Learning vs. Cognitive Modeling: Why neural networks excel at pattern matching but struggle with causal reasoning compared to symbolic cognitive architectures.',
      imageUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600',
      privacy: 'PUBLIC',
      authorId: sarah.id,
      likes: [fahmida.id],
      comments: [],
    },
    {
      content: 'Navigating Git Workflows in Large Product Teams: How trunk-based development and linear git histories keep the CI/CD pipeline green.',
      imageUrl: 'https://images.unsplash.com/photo-1556075798-482a21675391?w=600',
      privacy: 'PUBLIC',
      authorId: rahat.id,
      likes: [sarah.id],
      comments: [],
    },
    {
      content: 'Cybersecurity in Implantable Medical Devices: Protecting pacemakers and neurostimulators against telemetry sniffing and remote buffer attacks.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
      privacy: 'PUBLIC',
      authorId: fahmida.id,
      likes: [sarah.id, rahat.id],
      comments: [
        {
          authorId: sarah.id,
          content: 'Security by design should be mandatory for any biotech systems.',
          likes: [fahmida.id],
          replies: [],
        },
      ],
    },
  ];

  for (const p of postsData) {
    const post = await prisma.post.create({
      data: {
        content: p.content,
        imageUrl: p.imageUrl,
        privacy: p.privacy as any,
        authorId: p.authorId,
      },
    });

    // Seed post likes
    for (const userId of p.likes) {
      await prisma.postLike.create({
        data: {
          postId: post.id,
          userId,
        },
      });
    }

    // Seed post comments
    for (const c of p.comments) {
      const comment = await prisma.comment.create({
        data: {
          content: c.content,
          postId: post.id,
          authorId: c.authorId,
        },
      });

      // Seed comment likes
      for (const userId of c.likes) {
        await prisma.commentLike.create({
          data: {
            commentId: comment.id,
            userId,
          },
        });
      }

      // Seed comment replies
      for (const r of c.replies) {
        const reply = await prisma.reply.create({
          data: {
            content: r.content,
            commentId: comment.id,
            authorId: r.authorId,
          },
        });

        // Seed reply likes
        for (const userId of r.likes) {
          await prisma.replyLike.create({
            data: {
              replyId: reply.id,
              userId,
            },
          });
        }
      }
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
