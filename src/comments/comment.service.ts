import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(postId: string, authorId: string, content: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: true,
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      author: {
        id: comment.author.id,
        firstName: comment.author.firstName,
        lastName: comment.author.lastName,
        email: comment.author.email,
        headline: comment.author.headline,
        avatarUrl: comment.author.avatarUrl,
        connectionsCount: comment.author.connectionsCount,
      },
      likes: [],
      replies: [],
    };
  }

  async createReply(commentId: string, authorId: string, content: string) {
    // Verify comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const reply = await this.prisma.reply.create({
      data: {
        content,
        commentId,
        authorId,
      },
      include: {
        author: true,
      },
    });

    return {
      id: reply.id,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      author: {
        id: reply.author.id,
        firstName: reply.author.firstName,
        lastName: reply.author.lastName,
        email: reply.author.email,
        headline: reply.author.headline,
        avatarUrl: reply.author.avatarUrl,
        connectionsCount: reply.author.connectionsCount,
      },
      likes: [],
    };
  }

  async deleteComment(commentId: string, authorId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return {
      success: true,
      message: 'Comment successfully deleted',
    };
  }

  async deleteReply(replyId: string, authorId: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    if (reply.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own replies');
    }

    await this.prisma.reply.delete({
      where: { id: replyId },
    });

    return {
      success: true,
      message: 'Reply successfully deleted',
    };
  }
}
