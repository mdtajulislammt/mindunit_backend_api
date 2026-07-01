import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getDirectory(currentUserId: string): Promise<{
        connectionStatus: string;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        headline: string;
        avatarUrl: string | null;
        connectionsCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
