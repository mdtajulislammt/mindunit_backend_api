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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const like_service_1 = require("./like.service");
const swagger_1 = require("@nestjs/swagger");
let LikeController = class LikeController {
    likeService;
    constructor(likeService) {
        this.likeService = likeService;
    }
    async togglePostLike(postId, req) {
        return this.likeService.togglePostLike(postId, req.user.id);
    }
    async getPostLikes(postId) {
        return this.likeService.getPostLikes(postId);
    }
    async toggleCommentLike(commentId, req) {
        return this.likeService.toggleCommentLike(commentId, req.user.id);
    }
    async toggleReplyLike(replyId, req) {
        return this.likeService.toggleReplyLike(replyId, req.user.id);
    }
};
exports.LikeController = LikeController;
__decorate([
    (0, common_1.Post)('posts/:id/like'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like status for a post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post like successfully toggled.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "togglePostLike", null);
__decorate([
    (0, common_1.Get)('posts/:id/likes'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of users who liked a post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Likers retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "getPostLikes", null);
__decorate([
    (0, common_1.Post)('comments/:id/like'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like status for a comment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment like successfully toggled.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "toggleCommentLike", null);
__decorate([
    (0, common_1.Post)('replies/:id/like'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle like status for a reply' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reply like successfully toggled.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reply not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LikeController.prototype, "toggleReplyLike", null);
exports.LikeController = LikeController = __decorate([
    (0, swagger_1.ApiTags)('Engagement (Likes)'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [like_service_1.LikeService])
], LikeController);
//# sourceMappingURL=like.controller.js.map