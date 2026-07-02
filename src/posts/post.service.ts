import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Privacy } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, authorId: string) {
    const privacyEnum = createPostDto.privacy
      ? (createPostDto.privacy.toUpperCase() as Privacy)
      : Privacy.PUBLIC;

    const post = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        imageUrl: createPostDto.imageUrl,
        privacy: privacyEnum,
        authorId,
      },
      include: {
        author: true,
      },
    });

    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      privacy: post.privacy.toLowerCase(),
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        email: post.author.email,
        headline: post.author.headline,
        avatarUrl: post.author.avatarUrl,
        connectionsCount: post.author.connectionsCount,
      },
      likes: [],
      comments: [],
    };
  }

  async getFeed(currentUserId: string, limit = 10, cursor?: string) {
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        OR: [
          { privacy: Privacy.PUBLIC },
          { authorId: currentUserId },
        ],
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            author: true,
            likes: {
              select: {
                userId: true,
              },
            },
            replies: {
              include: {
                author: true,
                likes: {
                  select: {
                    userId: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      privacy: post.privacy.toLowerCase(),
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        email: post.author.email,
        headline: post.author.headline,
        avatarUrl: post.author.avatarUrl,
        connectionsCount: post.author.connectionsCount,
      },
      likes: post.likes.map((l) => l.userId),
      comments: post.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        author: {
          id: c.author.id,
          firstName: c.author.firstName,
          lastName: c.author.lastName,
          email: c.author.email,
          headline: c.author.headline,
          avatarUrl: c.author.avatarUrl,
          connectionsCount: c.author.connectionsCount,
        },
        likes: c.likes.map((l) => l.userId),
        replies: c.replies.map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt.toISOString(),
          author: {
            id: r.author.id,
            firstName: r.author.firstName,
            lastName: r.author.lastName,
            email: r.author.email,
            headline: r.author.headline,
            avatarUrl: r.author.avatarUrl,
            connectionsCount: r.author.connectionsCount,
          },
          likes: r.likes.map((l) => l.userId),
        })),
      })),
    }));
  }

  async update(postId: string, updatePostDto: any, authorId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    const data: any = {};
    if (updatePostDto.content !== undefined) data.content = updatePostDto.content;
    if (updatePostDto.imageUrl !== undefined) data.imageUrl = updatePostDto.imageUrl;
    if (updatePostDto.privacy !== undefined) {
      data.privacy = updatePostDto.privacy.toUpperCase() as Privacy;
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data,
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            author: true,
            likes: {
              select: {
                userId: true,
              },
            },
            replies: {
              include: {
                author: true,
                likes: {
                  select: {
                    userId: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return {
      id: updatedPost.id,
      content: updatedPost.content,
      imageUrl: updatedPost.imageUrl,
      privacy: updatedPost.privacy.toLowerCase(),
      createdAt: updatedPost.createdAt.toISOString(),
      author: {
        id: updatedPost.author.id,
        firstName: updatedPost.author.firstName,
        lastName: updatedPost.author.lastName,
        email: updatedPost.author.email,
        headline: updatedPost.author.headline,
        avatarUrl: updatedPost.author.avatarUrl,
        connectionsCount: updatedPost.author.connectionsCount,
      },
      likes: updatedPost.likes.map((l) => l.userId),
      comments: updatedPost.comments.map((c) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        author: {
          id: c.author.id,
          firstName: c.author.firstName,
          lastName: c.author.lastName,
          email: c.author.email,
          headline: c.author.headline,
          avatarUrl: c.author.avatarUrl,
          connectionsCount: c.author.connectionsCount,
        },
        likes: c.likes.map((l) => l.userId),
        replies: c.replies.map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt.toISOString(),
          author: {
            id: r.author.id,
            firstName: r.author.firstName,
            lastName: r.author.lastName,
            email: r.author.email,
            headline: r.author.headline,
            avatarUrl: r.author.avatarUrl,
            connectionsCount: r.author.connectionsCount,
          },
          likes: r.likes.map((l) => l.userId),
        })),
      })),
    };
  }

  async delete(postId: string, authorId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return {
      success: true,
      message: 'Post successfully deleted',
    };
  }
}
