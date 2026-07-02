import { CommentService } from './comment.service';
export declare class CommentController {
    private commentService;
    constructor(commentService: CommentService);
    deleteComment(commentId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteReply(replyId: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
