import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async getGroups(userId: string) {
    const groups = await this.prisma.group.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const joinedMemberships = await this.prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });

    const joinedGroupIds = new Set(joinedMemberships.map((m) => m.groupId));

    return groups.map((group) => ({
      ...group,
      isJoined: joinedGroupIds.has(group.id),
    }));
  }

  async toggleJoin(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const existingMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (existingMembership) {
      // Leave group (delete member and decrement count)
      await this.prisma.$transaction([
        this.prisma.groupMember.delete({
          where: {
            groupId_userId: {
              groupId,
              userId,
            },
          },
        }),
        this.prisma.group.update({
          where: { id: groupId },
          data: {
            membersCount: {
              decrement: 1,
            },
          },
        }),
      ]);
      return { isJoined: false };
    } else {
      // Join group (create member and increment count)
      await this.prisma.$transaction([
        this.prisma.groupMember.create({
          data: {
            groupId,
            userId,
          },
        }),
        this.prisma.group.update({
          where: { id: groupId },
          data: {
            membersCount: {
              increment: 1,
            },
          },
        }),
      ]);
      return { isJoined: true };
    }
  }
}
