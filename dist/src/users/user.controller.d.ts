import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadService } from '../upload/upload.service';
export declare class UserController {
    private userService;
    private uploadService;
    constructor(userService: UserService, uploadService: UploadService);
    getDirectory(req: any): Promise<{
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
    getMyProfile(req: any): Promise<{
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
    getUserProfile(userId: string): Promise<{
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
    updateProfile(updateProfileDto: UpdateProfileDto, file: Express.Multer.File, req: any): Promise<{
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
