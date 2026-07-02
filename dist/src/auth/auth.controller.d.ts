import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
            resetToken: string | null;
            resetTokenExp: Date | null;
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
            resetToken: string | null;
            resetTokenExp: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
        accessToken: string;
    }>;
    sendCode(sendCodeDto: SendCodeDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
