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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_service_1 = require("./user.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../upload/upload.service");
let UserController = class UserController {
    userService;
    uploadService;
    constructor(userService, uploadService) {
        this.userService = userService;
        this.uploadService = uploadService;
    }
    async getDirectory(req) {
        return this.userService.getDirectory(req.user.id);
    }
    async getMyProfile(req) {
        return this.userService.getProfile(req.user.id);
    }
    async getUserProfile(userId) {
        return this.userService.getProfile(userId);
    }
    async updateProfile(updateProfileDto, file, req) {
        let avatarUrl = updateProfileDto.avatarUrl;
        if (file) {
            avatarUrl = await this.uploadService.uploadFile(file);
        }
        return this.userService.updateProfile(req.user.id, { ...updateProfileDto, avatarUrl });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('directory'),
    (0, swagger_1.ApiOperation)({ summary: 'Get professional directory of other users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Directory successfully retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDirectory", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current logged-in user profile (including posts, connections, and joined groups)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile successfully retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)(':id/profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get another user profile by ID (including posts, connections, and joined groups)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile successfully retrieved.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User profile not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string', description: 'Updated first name' },
                lastName: { type: 'string', description: 'Updated last name' },
                headline: { type: 'string', description: 'Updated headline' },
                avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Updated avatar picture upload (optional)',
                },
            },
        },
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update current logged-in user profile (metadata and/or avatar)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_profile_dto_1.UpdateProfileDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService,
        upload_service_1.UploadService])
], UserController);
//# sourceMappingURL=user.controller.js.map