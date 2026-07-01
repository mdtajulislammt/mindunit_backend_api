import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async togglePostLike(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      return { liked: false };
    } else {
      await this.prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });
      return { liked: true };
    }
  }

  async getPostLikes(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const likes = await this.prisma.postLike.findMany({
      where: { postId },
      include: {
        user: true,
      },
    });

    return likes.map((like) => ({
      id: like.user.id,
      firstName: like.user.firstName,
      lastName: like.user.lastName,
      headline: like.user.headline,
      avatarUrl: like.user.avatarUrl,
    }));
  }

  async toggleCommentLike(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.commentLike.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });
      return { liked: false };
    } else {
      await this.prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
      return { liked: true };
    }
  }

  async toggleReplyLike(replyId: string, userId: string) {
    const reply = await this.prisma.reply.findUnique({
      where: { id: replyId },
    });
    if (!reply) {
      throw new NotFoundException('Reply not found');
    }

    const existingLike = await this.prisma.replyLike.findUnique({
      where: {
        replyId_userId: {
          replyId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.replyLike.delete({
        where: {
          replyId_userId: {
            replyId,
            userId,
          },
        },
      });
      return { liked: false };
    } else {
      await this.prisma.replyLike.create({
        data: {
          replyId,
          userId,
        },
      });
      return { liked: true };
    }
  }
}
