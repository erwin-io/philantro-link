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
exports.SupportTicketController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const support_ticket_base_dto_1 = require("../../core/dto/support-ticket/support-ticket-base.dto");
const support_ticket_create_dto_1 = require("../../core/dto/support-ticket/support-ticket.create.dto");
const support_ticket_update_dto_1 = require("../../core/dto/support-ticket/support-ticket.update.dto");
const support_ticket_service_1 = require("../../services/support-ticket.service");
let SupportTicketController = class SupportTicketController {
    constructor(supportTicketService) {
        this.supportTicketService = supportTicketService;
    }
    async getDetails(supportTicketCode, currentUserCode) {
        const res = {};
        try {
            res.data = await this.supportTicketService.getByCode(supportTicketCode, currentUserCode);
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
            res.data = await this.supportTicketService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async createSupportTicket(dto) {
        const res = {};
        try {
            res.data = await this.supportTicketService.createSupportTicket(dto);
            res.success = true;
            res.message = `Support Ticket ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateSupportTicket(supportTicketCode, dto) {
        const res = {};
        try {
            res.data = await this.supportTicketService.updateSupportTicket(supportTicketCode, dto);
            res.success = true;
            res.message = `Support Ticket ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(supportTicketCode, dto) {
        const res = {};
        try {
            res.data = await this.supportTicketService.updateStatus(supportTicketCode, dto);
            res.success = true;
            res.message = `Support Ticket status ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getMessagePaginated(params) {
        const res = {};
        try {
            res.data = await this.supportTicketService.getMessagePagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async postMessage(dto) {
        const res = {};
        try {
            res.data = await this.supportTicketService.postMessage(dto);
            res.success = true;
            res.message = `Support Ticket Message Sent!`;
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
    (0, common_1.Get)("/:supportTicketCode"),
    (0, swagger_1.ApiQuery)({
        name: "currentUserCode",
        required: false,
        description: "Current User code",
    }),
    __param(0, (0, common_1.Param)("supportTicketCode")),
    __param(1, (0, common_1.Query)("currentUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [support_ticket_create_dto_1.CreateSupportTicketDto]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "createSupportTicket", null);
__decorate([
    (0, common_1.Put)("/:supportTicketCode"),
    __param(0, (0, common_1.Param)("supportTicketCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_ticket_update_dto_1.UpdateSupportTicketDto]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "updateSupportTicket", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:supportTicketCode"),
    __param(0, (0, common_1.Param)("supportTicketCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, support_ticket_update_dto_1.UpdateSupportTicketStatusDto]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)("/message/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "getMessagePaginated", null);
__decorate([
    (0, common_1.Post)("/message/"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [support_ticket_base_dto_1.SupportTicketMessageDto]),
    __metadata("design:returntype", Promise)
], SupportTicketController.prototype, "postMessage", null);
SupportTicketController = __decorate([
    (0, swagger_1.ApiTags)("support-ticket"),
    (0, common_1.Controller)("support-ticket"),
    __metadata("design:paramtypes", [support_ticket_service_1.SupportTicketService])
], SupportTicketController);
exports.SupportTicketController = SupportTicketController;
//# sourceMappingURL=support-ticket.controller.js.map