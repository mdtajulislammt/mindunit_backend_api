import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createPostDto: CreatePostDto, authorId: string): Promise<{
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
    getFeed(currentUserId: string): Promise<{
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
    update(postId: string, updatePostDto: any, authorId: string): Promise<{
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
    }>;
    delete(postId: string, authorId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
