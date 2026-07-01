import { Controller, Post, Get, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LikeService } from './like.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Engagement (Likes)')
@ApiBearerAuth('JWT-auth')
@Controller()
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post('posts/:id/like')
  @ApiOperation({ summary: 'Toggle like status for a post' })
  @ApiResponse({ status: 201, description: 'Post like successfully toggled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async togglePostLike(@Param('id') postId: string, @Request() req) {
    return this.likeService.togglePostLike(postId, req.user.id);
  }

  @Get('posts/:id/likes')
  @ApiOperation({ summary: 'Get list of users who liked a post' })
  @ApiResponse({ status: 200, description: 'Likers retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async getPostLikes(@Param('id') postId: string) {
    return this.likeService.getPostLikes(postId);
  }

  @Post('comments/:id/like')
  @ApiOperation({ summary: 'Toggle like status for a comment' })
  @ApiResponse({ status: 201, description: 'Comment like successfully toggled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async toggleCommentLike(@Param('id') commentId: string, @Request() req) {
    return this.likeService.toggleCommentLike(commentId, req.user.id);
  }

  @Post('replies/:id/like')
  @ApiOperation({ summary: 'Toggle like status for a reply' })
  @ApiResponse({ status: 201, description: 'Reply like successfully toggled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Reply not found.' })
  async toggleReplyLike(@Param('id') replyId: string, @Request() req) {
    return this.likeService.toggleReplyLike(replyId, req.user.id);
  }
}
