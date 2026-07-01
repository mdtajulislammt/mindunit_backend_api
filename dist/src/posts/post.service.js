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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PostService = class PostService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPostDto, authorId) {
        const privacyEnum = createPostDto.privacy
            ? createPostDto.privacy.toUpperCase()
            : client_1.Privacy.PUBLIC;
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
    async getFeed(currentUserId) {
        const posts = await this.prisma.post.findMany({
            where: {
                OR: [
                    { privacy: client_1.Privacy.PUBLIC },
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
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
//# sourceMappingURL=post.service.js.map