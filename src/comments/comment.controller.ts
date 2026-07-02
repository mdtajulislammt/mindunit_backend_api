import { Controller, Delete, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Comments & Replies')
@ApiBearerAuth('JWT-auth')
@Controller()
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (not the author).' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async deleteComment(@Param('id') commentId: string, @Request() req) {
    return this.commentService.deleteComment(commentId, req.user.id);
  }

  @Delete('replies/:id')
  @ApiOperation({ summary: 'Delete a comment reply' })
  @ApiResponse({ status: 200, description: 'Reply successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (not the author).' })
  @ApiResponse({ status: 404, description: 'Reply not found.' })
  async deleteReply(@Param('id') replyId: string, @Request() req) {
    return this.commentService.deleteReply(replyId, req.user.id);
  }
}
