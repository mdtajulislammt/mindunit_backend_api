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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createComment(postId, authorId, content) {
        const post = await this.prisma.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw new common_1.NotFoundException('Post not found');
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
    async createReply(commentId, authorId, content) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
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
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
//# sourceMappingURL=comment.service.js.map