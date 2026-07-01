import { LikeService } from './like.service';
export declare class LikeController {
    private likeService;
    constructor(likeService: LikeService);
    togglePostLike(postId: string, req: any): Promise<{
        liked: boolean;
    }>;
    getPostLikes(postId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        headline: string;
        avatarUrl: string | null;
    }[]>;
    toggleCommentLike(commentId: string, req: any): Promise<{
        liked: boolean;
    }>;
    toggleReplyLike(replyId: string, req: any): Promise<{
        liked: boolean;
    }>;
}
