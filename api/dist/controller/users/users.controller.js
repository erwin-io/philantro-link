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
const map_dto_1 = require("../../core/dto/map/map.dto");
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
    async createClientUser(createUserDto) {
        const res = {};
        try {
            res.data = await this.userService.createClientUser(createUserDto);
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
    async createAdminUser(createUserDto) {
        const res = {};
        try {
            res.data = await this.userService.createAdminUser(createUserDto);
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
    async updateAdminProfile(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateAdminProfile(userCode, dto);
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
    async updateClientProfile(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateClientProfile(userCode, dto);
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
    async updateClientUser(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateClientUser(userCode, dto);
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
    async updateAdminUser(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateAdminUser(userCode, dto);
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
    async profileResetPassword(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.profileResetPassword(userCode, dto);
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
    async updateUserPassword(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateUserPassword(userCode, dto);
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
    async updateUserLocation(userCode, dto) {
        const res = {};
        try {
            res.data = await this.userService.updateUserLocation(userCode, dto);
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
    (0, common_1.Post)("/createClientUser"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_create_dto_1.CreateClientUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createClientUser", null);
__decorate([
    (0, common_1.Post)("/createAdminUser"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_create_dto_1.CreateAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createAdminUser", null);
__decorate([
    (0, common_1.Put)("/updateAdminProfile/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_update_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAdminProfile", null);
__decorate([
    (0, common_1.Put)("/updateClientProfile/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_update_dto_1.UpdateClientUserProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateClientProfile", null);
__decorate([
    (0, common_1.Put)("/updateClientUser/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_update_dto_1.UpdateClientUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateClientUser", null);
__decorate([
    (0, common_1.Put)("/updateAdminUser/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, users_update_dto_1.UpdateAdminUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateAdminUser", null);
__decorate([
    (0, common_1.Put)("/profileResetPassword/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.ProfileResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "profileResetPassword", null);
__decorate([
    (0, common_1.Put)("/updateUserPassword/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.UpdateUserPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserPassword", null);
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
    (0, common_1.Put)("/updateUserLocation/:userCode"),
    __param(0, (0, common_1.Param)("userCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, map_dto_1.MapDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserLocation", null);
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