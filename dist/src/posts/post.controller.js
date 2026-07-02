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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const post_service_1 = require("./post.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const update_post_dto_1 = require("./dto/update-post.dto");
const comment_service_1 = require("../comments/comment.service");
const create_comment_dto_1 = require("../comments/dto/create-comment.dto");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../upload/upload.service");
let PostController = class PostController {
    postService;
    commentService;
    uploadService;
    constructor(postService, commentService, uploadService) {
        this.postService = postService;
        this.commentService = commentService;
        this.uploadService = uploadService;
    }
    async create(createPostDto, file, req) {
        let imageUrl = createPostDto.imageUrl;
        if (file) {
            imageUrl = await this.uploadService.uploadFile(file);
        }
        return this.postService.create({ ...createPostDto, imageUrl }, req.user.id);
    }
    async getFeed(req) {
        return this.postService.getFeed(req.user.id);
    }
    async createComment(postId, createCommentDto, req) {
        return this.commentService.createComment(postId, req.user.id, createCommentDto.content);
    }
    async createReply(postId, commentId, createCommentDto, req) {
        return this.commentService.createReply(commentId, req.user.id, createCommentDto.content);
    }
    async update(postId, updatePostDto, file, req) {
        let imageUrl = updatePostDto.imageUrl;
        if (file) {
            imageUrl = await this.uploadService.uploadFile(file);
        }
        return this.postService.update(postId, { ...updatePostDto, imageUrl }, req.user.id);
    }
    async delete(postId, req) {
        return this.postService.delete(postId, req.user.id);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new post (supports raw image upload or text)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Post successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve news feed (public posts + own private posts)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feed successfully fetched.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getFeed", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment to a post' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment successfully added.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createComment", null);
__decorate([
    (0, common_1.Post)(':postId/comments/:commentId/replies'),
    (0, swagger_1.ApiOperation)({ summary: 'Reply to a comment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reply successfully added.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Comment not found.' }),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createReply", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string', description: 'Updated post text content' },
                privacy: { type: 'string', enum: ['public', 'private'], description: 'Updated post privacy setting' },
                image: {
                    type: 'string',
                    format: 'binary',
                    description: 'New image file to upload (optional)',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update/Edit an existing post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden (not the author).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_post_dto_1.UpdatePostDto, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Post successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden (not the author).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Post not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "delete", null);
exports.PostController = PostController = __decorate([
    (0, swagger_1.ApiTags)('Posts & News Feed'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('posts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [post_service_1.PostService,
        comment_service_1.CommentService,
        upload_service_1.UploadService])
], PostController);
//# sourceMappingURL=post.controller.js.map