/// <reference types="multer" />
import { Controller, Post, Get, Body, UseGuards, Request, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentService } from '../comments/comment.service';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from '../upload/upload.service';

@ApiTags('Posts & News Feed')
@ApiBearerAuth('JWT-auth')
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Post text content' },
        privacy: { type: 'string', enum: ['public', 'private'], default: 'public', description: 'Post privacy setting' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload to the cloud',
        },
      },
      required: ['content'],
    },
  })
  @ApiOperation({ summary: 'Create a new post (supports raw image upload or text)' })
  @ApiResponse({ status: 201, description: 'Post successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    let imageUrl = createPostDto.imageUrl;
    if (file) {
      imageUrl = await this.uploadService.uploadFile(file);
    }
    return this.postService.create({ ...createPostDto, imageUrl }, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve news feed (public posts + own private posts)' })
  @ApiResponse({ status: 200, description: 'Feed successfully fetched.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getFeed(@Request() req) {
    return this.postService.getFeed(req.user.id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment successfully added.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async createComment(
    @Param('id') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentService.createComment(postId, req.user.id, createCommentDto.content);
  }

  @Post(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: 'Reply to a comment' })
  @ApiResponse({ status: 201, description: 'Reply successfully added.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async createReply(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.commentService.createReply(commentId, req.user.id, createCommentDto.content);
  }
}
