import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
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
            firstName: string;
            lastName: string;
            email: string;
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
    sendCode(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyCode(email: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
