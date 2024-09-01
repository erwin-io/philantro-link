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
exports.UserConversationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const user_conversation_service_1 = require("../../services/user-conversation.service");
let UserConversationController = class UserConversationController {
    constructor(userConversationService) {
        this.userConversationService = userConversationService;
    }
    async getById(userConversationId) {
        const res = {};
        try {
            res.data = await this.userConversationService.getById(userConversationId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getUnreadByUser(userId) {
        const res = {};
        try {
            res.data = await this.userConversationService.getUnreadByUser(userId);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.userConversationService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(userConversationId) {
        const res = {};
        try {
            res.data = await this.userConversationService.markAsRead(userConversationId);
            res.success = true;
            res.message = `User Conversation ${api_response_constant_1.UPDATE_SUCCESS}`;
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
    (0, common_1.Get)("/:userConversationId"),
    __param(0, (0, common_1.Param)("userConversationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserConversationController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)("/getUnreadByUser/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserConversationController.prototype, "getUnreadByUser", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], UserConversationController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Put)("/marAsRead/:userConversationId/"),
    __param(0, (0, common_1.Param)("userConversationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserConversationController.prototype, "updateStatus", null);
UserConversationController = __decorate([
    (0, swagger_1.ApiTags)("user-conversation"),
    (0, common_1.Controller)("user-conversation"),
    __metadata("design:paramtypes", [user_conversation_service_1.UserConversationService])
], UserConversationController);
exports.UserConversationController = UserConversationController;
//# sourceMappingURL=user-conversation.controller.js.map