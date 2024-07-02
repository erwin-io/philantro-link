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
exports.TransactionsController = exports.RequestPaymentDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const transactions_service_1 = require("../../services/transactions.service");
class RequestPaymentDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: Number,
        default: 20,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(20),
    __metadata("design:type", Number)
], RequestPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestPaymentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RequestPaymentDto.prototype, "eventId", void 0);
exports.RequestPaymentDto = RequestPaymentDto;
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async getByCode(transactionCode) {
        const res = {};
        try {
            res.data = await this.transactionsService.getByCode(transactionCode);
            res.success = true;
            return res;
        }
        catch (e) {
            throw e;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.transactionsService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async requestPaymentLink(params) {
        const res = {};
        try {
            res.data = await this.transactionsService.requestPaymentLink(params);
            res.success = true;
            return res;
        }
        catch (e) {
            throw e;
        }
    }
    async comleteTopUpPayment(paymentReferenceCode) {
        const res = {};
        try {
            res.data = await this.transactionsService.comleteTopUpPayment(paymentReferenceCode);
            res.success = true;
            return res;
        }
        catch (e) {
            throw e;
        }
    }
    async expirePaymentLink(id) {
        const res = {};
        try {
            res.data = await this.transactionsService.expirePaymentLink(id);
            res.success = true;
            return res;
        }
        catch (e) {
            throw e;
        }
    }
};
__decorate([
    (0, common_1.Get)("/:transactionCode"),
    __param(0, (0, common_1.Param)("transactionCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getByCode", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)("/requestPaymentLink/"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestPaymentDto]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "requestPaymentLink", null);
__decorate([
    (0, common_1.Put)("/comleteTopUpPayment/:paymentReferenceCode"),
    __param(0, (0, common_1.Param)("paymentReferenceCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "comleteTopUpPayment", null);
__decorate([
    (0, common_1.Delete)("/expirePaymentLink/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "expirePaymentLink", null);
TransactionsController = __decorate([
    (0, swagger_1.ApiTags)("transactions"),
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
exports.TransactionsController = TransactionsController;
//# sourceMappingURL=transactions.controller.js.map