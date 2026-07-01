import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
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
}
