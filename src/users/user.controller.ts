/// <reference types="multer" />
import { Controller, Get, Put, UseGuards, Request, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private uploadService: UploadService,
  ) {}

  @Get('directory')
  @ApiOperation({ summary: 'Get professional directory of other users' })
  @ApiResponse({ status: 200, description: 'Directory successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getDirectory(@Request() req) {
    return this.userService.getDirectory(req.user.id);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current logged-in user profile (including posts, connections, and joined groups)' })
  @ApiResponse({ status: 200, description: 'Profile successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMyProfile(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get another user profile by ID (including posts, connections, and joined groups)' })
  @ApiResponse({ status: 200, description: 'Profile successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getUserProfile(@Param('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Put('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'Updated first name' },
        lastName: { type: 'string', description: 'Updated last name' },
        headline: { type: 'string', description: 'Updated headline' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Updated avatar picture upload (optional)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update current logged-in user profile (metadata and/or avatar)' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    let avatarUrl = updateProfileDto.avatarUrl;
    if (file) {
      avatarUrl = await this.uploadService.uploadFile(file);
    }
    return this.userService.updateProfile(req.user.id, { ...updateProfileDto, avatarUrl });
  }
}
