import { Controller, Get, Post, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroupService } from './group.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Communities & Groups')
@ApiBearerAuth('JWT-auth')
@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  @ApiOperation({ summary: 'List recommended groups for the user' })
  @ApiResponse({ status: 200, description: 'Groups list successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getGroups(@Request() req) {
    return this.groupService.getGroups(req.user.id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Toggle group membership (join or leave)' })
  @ApiResponse({ status: 201, description: 'Group membership successfully toggled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Group not found.' })
  async toggleJoin(@Param('id') groupId: string, @Request() req) {
    return this.groupService.toggleJoin(groupId, req.user.id);
  }
}
