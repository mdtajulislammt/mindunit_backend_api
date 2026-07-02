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
    getProfile(profileUserId: string): Promise<{
        user: {
            createdAt: string;
            updatedAt: string;
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            headline: string;
            avatarUrl: string | null;
            connectionsCount: number;
        };
        posts: {
            id: string;
            content: string;
            imageUrl: string | null;
            privacy: string;
            createdAt: string;
            author: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                headline: string;
                avatarUrl: string | null;
                connectionsCount: number;
            };
            likes: string[];
            comments: {
                id: string;
                content: string;
                createdAt: string;
                author: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    email: string;
                    headline: string;
                    avatarUrl: string | null;
                    connectionsCount: number;
                };
                likes: string[];
                replies: {
                    id: string;
                    content: string;
                    createdAt: string;
                    author: {
                        id: string;
                        firstName: string;
                        lastName: string;
                        email: string;
                        headline: string;
                        avatarUrl: string | null;
                        connectionsCount: number;
                    };
                    likes: string[];
                }[];
            }[];
        }[];
        joinedGroups: {
            id: string;
            name: string;
            category: string;
            avatarUrl: string;
            membersCount: number;
            createdAt: string;
            isJoined: boolean;
        }[];
        connections: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            headline: string;
            avatarUrl: string | null;
            connectionsCount: number;
        }[];
    }>;
    updateProfile(userId: string, updateProfileDto: any): Promise<{
        createdAt: string;
        updatedAt: string;
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        headline: string;
        avatarUrl: string | null;
        connectionsCount: number;
    }>;
}
