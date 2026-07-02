import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getDirectory(currentUserId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        headline: true,
        avatarUrl: true,
        connectionsCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Map a mock connectionStatus to each user as requested by the specification.
    // In our simplified database schema, actual connection links are not persisted, 
    // so we return a default status that the frontend can toggle locally.
    return users.map((user) => ({
      ...user,
      connectionStatus: 'CONNECT',
    }));
  }

  async getProfile(profileUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: profileUserId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        headline: true,
        avatarUrl: true,
        connectionsCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    // Fetch the user's posts (including their likes and comments)
    const posts = await this.prisma.post.findMany({
      where: { authorId: profileUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            author: true,
            likes: {
              select: {
                userId: true,
              },
            },
            replies: {
              include: {
                author: true,
                likes: {
                  select: {
                    userId: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    const formattedPosts = posts.map((p) => ({
      id: p.id,
      content: p.content,
      imageUrl: p.imageUrl,
      privacy: p.privacy.toLowerCase(),
      createdAt: p.createdAt.toISOString(),
      author: {
        id: p.author.id,
        firstName: p.author.firstName,
        lastName: p.author.lastName,
        email: p.author.email,
        headline: p.author.headline,
        avatarUrl: p.author.avatarUrl,
        connectionsCount: p.author.connectionsCount,
      },
      likes: p.likes.map((l) => l.userId),
      comments: p.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        author: {
          id: c.author.id,
          firstName: c.author.firstName,
          lastName: c.author.lastName,
          email: c.author.email,
          headline: c.author.headline,
          avatarUrl: c.author.avatarUrl,
          connectionsCount: c.author.connectionsCount,
        },
        likes: c.likes.map((l) => l.userId),
        replies: c.replies.map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt.toISOString(),
          author: {
            id: r.author.id,
            firstName: r.author.firstName,
            lastName: r.author.lastName,
            email: r.author.email,
            headline: r.author.headline,
            avatarUrl: r.author.avatarUrl,
            connectionsCount: r.author.connectionsCount,
          },
          likes: r.likes.map((l) => l.userId),
        })),
      })),
    }));

    // Fetch the groups this user has joined
    const joinedGroups = await this.prisma.groupMember.findMany({
      where: { userId: profileUserId },
      include: {
        group: true,
      },
    });

    const formattedGroups = joinedGroups.map((gm) => ({
      id: gm.group.id,
      name: gm.group.name,
      category: gm.group.category,
      avatarUrl: gm.group.avatarUrl,
      membersCount: gm.group.membersCount,
      createdAt: gm.group.createdAt.toISOString(),
      isJoined: true,
    }));

    // Fetch mock connections
    const otherUsers = await this.prisma.user.findMany({
      where: {
        id: { not: profileUserId },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        headline: true,
        avatarUrl: true,
        connectionsCount: true,
      },
      take: 5,
    });

    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      posts: formattedPosts,
      joinedGroups: formattedGroups,
      connections: otherUsers,
    };
  }

  async updateProfile(userId: string, updateProfileDto: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data: any = {};
    if (updateProfileDto.firstName !== undefined) data.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName !== undefined) data.lastName = updateProfileDto.lastName;
    if (updateProfileDto.headline !== undefined) data.headline = updateProfileDto.headline;
    if (updateProfileDto.avatarUrl !== undefined) data.avatarUrl = updateProfileDto.avatarUrl;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        headline: true,
        avatarUrl: true,
        connectionsCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
  }
}
