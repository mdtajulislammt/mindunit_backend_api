"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LikeService = class LikeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async togglePostLike(postId, userId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
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
        }
        else {
            await this.prisma.postLike.create({
                data: {
                    postId,
                    userId,
                },
            });
            return { liked: true };
        }
    }
    async getPostLikes(postId) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
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
    async toggleCommentLike(commentId, userId) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
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
        }
        else {
            await this.prisma.commentLike.create({
                data: {
                    commentId,
                    userId,
                },
            });
            return { liked: true };
        }
    }
    async toggleReplyLike(replyId, userId) {
        const reply = await this.prisma.reply.findUnique({
            where: { id: replyId },
        });
        if (!reply) {
            throw new common_1.NotFoundException('Reply not found');
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
        }
        else {
            await this.prisma.replyLike.create({
                data: {
                    replyId,
                    userId,
                },
            });
            return { liked: true };
        }
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikeService);
//# sourceMappingURL=like.service.js.map