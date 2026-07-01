import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            headline: string;
            avatarUrl: string | null;
            connectionsCount: number;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            headline: string;
            avatarUrl: string | null;
            connectionsCount: number;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
        accessToken: string;
    }>;
}
