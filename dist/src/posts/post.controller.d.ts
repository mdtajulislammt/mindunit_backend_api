import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentService } from '../comments/comment.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UploadService } from '../upload/upload.service';
export declare class PostController {
    private postService;
    private commentService;
    private uploadService;
    constructor(postService: PostService, commentService: CommentService, uploadService: UploadService);
    create(createPostDto: CreatePostDto, file: Express.Multer.File, req: any): Promise<{
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
        likes: never[];
        comments: never[];
    }>;
    getFeed(req: any): Promise<{
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
    }[]>;
    createComment(postId: string, createCommentDto: CreateCommentDto, req: any): Promise<{
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
    createReply(postId: string, commentId: string, createCommentDto: CreateCommentDto, req: any): Promise<{
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
