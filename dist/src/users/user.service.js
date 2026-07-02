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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDirectory(currentUserId) {
        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    not: currentUserId,
                },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                headline: true,
                avatarUrl: true,
                connectionsCount: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return users.map((user) => ({
            ...user,
            connectionStatus: 'CONNECT',
        }));
    }
    async getProfile(profileUserId) {
        const user = await this.prisma.user.findUnique({
            where: { id: profileUserId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                headline: true,
                avatarUrl: true,
                connectionsCount: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User profile not found');
        }
        const posts = await this.prisma.post.findMany({
            where: { authorId: profileUserId },
            orderBy: { createdAt: 'desc' },
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
        const formattedPosts = posts.map((p) => ({
            id: p.id,
            content: p.content,
            imageUrl: p.imageUrl,
            privacy: p.privacy.toLowerCase(),
            createdAt: p.createdAt.toISOString(),
            author: {
                id: p.author.id,
                firstName: p.author.firstName,
                lastName: p.author.lastName,
                email: p.author.email,
                headline: p.author.headline,
                avatarUrl: p.author.avatarUrl,
                connectionsCount: p.author.connectionsCount,
            },
            likes: p.likes.map((l) => l.userId),
            comments: p.comments.map((c) => ({
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
        const joinedGroups = await this.prisma.groupMember.findMany({
            where: { userId: profileUserId },
            include: {
                group: true,
            },
        });
        const formattedGroups = joinedGroups.map((gm) => ({
            id: gm.group.id,
            name: gm.group.name,
            category: gm.group.category,
            avatarUrl: gm.group.avatarUrl,
            membersCount: gm.group.membersCount,
            createdAt: gm.group.createdAt.toISOString(),
            isJoined: true,
        }));
        const otherUsers = await this.prisma.user.findMany({
            where: {
                id: { not: profileUserId },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                headline: true,
                avatarUrl: true,
                connectionsCount: true,
            },
            take: 5,
        });
        return {
            user: {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
            posts: formattedPosts,
            joinedGroups: formattedGroups,
            connections: otherUsers,
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const data = {};
        if (updateProfileDto.firstName !== undefined)
            data.firstName = updateProfileDto.firstName;
        if (updateProfileDto.lastName !== undefined)
            data.lastName = updateProfileDto.lastName;
        if (updateProfileDto.headline !== undefined)
            data.headline = updateProfileDto.headline;
        if (updateProfileDto.avatarUrl !== undefined)
            data.avatarUrl = updateProfileDto.avatarUrl;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                headline: true,
                avatarUrl: true,
                connectionsCount: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return {
            ...updatedUser,
            createdAt: updatedUser.createdAt.toISOString(),
            updatedAt: updatedUser.updatedAt.toISOString(),
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map