import { PrismaService } from '../prisma/prisma.service';
export declare class LikeService {
    private prisma;
    constructor(prisma: PrismaService);
    togglePostLike(postId: string, userId: string): Promise<{
        liked: boolean;
    }>;
    getPostLikes(postId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        headline: string;
        avatarUrl: string | null;
    }[]>;
    toggleCommentLike(commentId: string, userId: string): Promise<{
        liked: boolean;
    }>;
    toggleReplyLike(replyId: string, userId: string): Promise<{
        liked: boolean;
    }>;
}
