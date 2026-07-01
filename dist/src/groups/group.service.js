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
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GroupService = class GroupService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGroups(userId) {
        const groups = await this.prisma.group.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        const joinedMemberships = await this.prisma.groupMember.findMany({
            where: { userId },
            select: { groupId: true },
        });
        const joinedGroupIds = new Set(joinedMemberships.map((m) => m.groupId));
        return groups.map((group) => ({
            ...group,
            isJoined: joinedGroupIds.has(group.id),
        }));
    }
    async toggleJoin(groupId, userId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
        });
        if (!group) {
            throw new common_1.NotFoundException('Group not found');
        }
        const existingMembership = await this.prisma.groupMember.findUnique({
            where: {
                groupId_userId: {
                    groupId,
                    userId,
                },
            },
        });
        if (existingMembership) {
            await this.prisma.$transaction([
                this.prisma.groupMember.delete({
                    where: {
                        groupId_userId: {
                            groupId,
                            userId,
                        },
                    },
                }),
                this.prisma.group.update({
                    where: { id: groupId },
                    data: {
                        membersCount: {
                            decrement: 1,
                        },
                    },
                }),
            ]);
            return { isJoined: false };
        }
        else {
            await this.prisma.$transaction([
                this.prisma.groupMember.create({
                    data: {
                        groupId,
                        userId,
                    },
                }),
                this.prisma.group.update({
                    where: { id: groupId },
                    data: {
                        membersCount: {
                            increment: 1,
                        },
                    },
                }),
            ]);
            return { isJoined: true };
        }
    }
};
exports.GroupService = GroupService;
exports.GroupService = GroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupService);
//# sourceMappingURL=group.service.js.map