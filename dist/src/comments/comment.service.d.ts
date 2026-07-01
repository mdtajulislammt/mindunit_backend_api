import { PrismaService } from '../prisma/prisma.service';
export declare class CommentService {
    private prisma;
    constructor(prisma: PrismaService);
    createComment(postId: string, authorId: string, content: string): Promise<{
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
        likes: never[];
        replies: never[];
    }>;
    createReply(commentId: string, authorId: string, content: string): Promise<{
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
        likes: never[];
    }>;
}
