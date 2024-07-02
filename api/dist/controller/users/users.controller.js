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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const reset_password_dto_1 = require("../../core/dto/auth/reset-password.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const user_base_dto_1 = require("../../core/dto/user/user-base.dto");
const users_create_dto_1 = require("../../core/dto/user/users.create.dto");
const users_update_dto_1 = require("../../core/dto/user/users.update.dto");
const users_service_1 = require("../../services/users.service");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUserDetailsDetails(userCode) {
        const res = {};
        try {
            res.data = await this.userService.getUserByCode(userCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getUserPagination(paginationParams) {
        const res = {};
        try {
            res.data = await this.userService.getUserPagination(paginationParams);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(createUserDto) {
        const res = {};
        try {
            res.data = await this.userService.create(createUserDto);
            res.success = true;
            res.message = `User  ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateProfile(userCode, updateUserProfileDto) {
        const res = {};
        try {
            res.data = await this.userService.updateProfile(userCode, updateUserProfileDto);
            res.success = true;
            res.message = `User ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(userCode, updateUserDto) {
        const res = {};
        try {
            res.data = await this.userService.update(userCode, updateUserDto);
            res.success = true;
            res.message = `User ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async resetPassword(userCode, updateUserResetPasswordDto) {
        const res = {};
        try {
            res.data = await this.userService.resetPassword(userCode, updateUserResetPasswordDto);
            res.success = true;
            res.message = `User password ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async deleteUser(userCode) {
        const res = {};
        try {
            res.data = await this.userService.deleteUser(userCode);
            res.success = true;
            res.message = `User ${api_response_constant_1.DELETE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async approveAccessRequest(userCode) {
        const res = {};
        try {
            res.data = await this.userService.approveAccessRequest(userCode);
            res.success = true;
            res.message = `User access request ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateProfilePicture(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateProfilePicture(userCode, dto);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/:userCode/details"),
    __param(0, (0, common_1.Param)("userCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserDetailsDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPagination", null);
__decorate([
    (0, common_1.Post)("/"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_create_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/updateProfile/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_update_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)("/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_update_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)("/:userCode/resetPassword"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.UpdateUserResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Delete)("/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Put)("/:userCode/approveAccessRequest"),
    __param(0, (0, common_1.Param)("userCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveAccessRequest", null);
__decorate([
    (0, common_1.Put)("/updateProfilePicture/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_base_dto_1.UpdateProfilePictureDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfilePicture", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map