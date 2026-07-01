import { Injectable } from '@nestjs/common';
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
}
