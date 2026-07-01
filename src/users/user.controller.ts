import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('directory')
  @ApiOperation({ summary: 'Get professional directory of other users' })
  @ApiResponse({ status: 200, description: 'Directory successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getDirectory(@Request() req) {
    return this.userService.getDirectory(req.user.id);
  }
}
