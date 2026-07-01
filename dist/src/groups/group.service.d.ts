import { PrismaService } from '../prisma/prisma.service';
export declare class GroupService {
    private prisma;
    constructor(prisma: PrismaService);
    getGroups(userId: string): Promise<{
        isJoined: boolean;
        id: string;
        avatarUrl: string;
        createdAt: Date;
        name: string;
        category: string;
        membersCount: number;
    }[]>;
    toggleJoin(groupId: string, userId: string): Promise<{
        isJoined: boolean;
    }>;
}
