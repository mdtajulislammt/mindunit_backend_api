import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
      },
    });

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Exclude passwordHash from output
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      accessToken: token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Match password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Exclude passwordHash from output
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      accessToken: token,
    };
  }

  async sendCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000);

    await this.prisma.verificationCode.deleteMany({
      where: { email },
    });

    await this.prisma.verificationCode.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    const mailSent = await this.mailService.sendMail(
      email,
      'Your MindUnite Verification Code',
      `Your verification code is: ${code}. It will expire in 15 minutes.`,
      `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">MindUnite Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">Your verification OTP code is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5; padding: 15px 0; text-align: center; background-color: #f5f3ff; border-radius: 6px; margin: 20px 0;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">This code is valid for 15 minutes. If you did not request this, you can ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">MindUnite Platform &copy; 2026</p>
      </div>
      `
    );

    if (!mailSent) {
      throw new BadRequestException('Failed to send verification email');
    }

    return {
      success: true,
      message: 'Verification code sent successfully',
    };
  }

  async verifyCode(email: string, code: string) {
    const codeRecord = await this.prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!codeRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.prisma.verificationCode.delete({
      where: { id: codeRecord.id },
    });

    return {
      success: true,
      message: 'Code verified successfully',
    };
  }

  async resetPassword(resetPasswordDto: any) {
    const { email, code, newPassword } = resetPasswordDto;

    const codeRecord = await this.prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!codeRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
      },
    });

    await this.prisma.verificationCode.delete({
      where: { id: codeRecord.id },
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
