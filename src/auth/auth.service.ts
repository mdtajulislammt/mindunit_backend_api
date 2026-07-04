import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { verificationCodeTemplate } from '../mail/templates/verification-code.template';

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
    const expiresAt = new Date(Date.now() + 10 * 60000);

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
      `Your verification code is: ${code}. It will expire in 10 minutes.`,
      verificationCodeTemplate(code),
    );

    console.log(
      `\n==================================================\n[DEVELOPMENT] Verification Code for ${email} is: ${code}\n==================================================\n`,
    );

    if (!mailSent) {
      console.warn(
        `[WARNING] Failed to send verification email via SMTP, falling back to simulation.`,
      );
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
