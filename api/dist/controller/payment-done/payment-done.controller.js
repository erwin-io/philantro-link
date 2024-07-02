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
exports.PaymentDoneController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_constant_1 = require("../../common/constant/payment.constant");
const transactions_service_1 = require("../../services/transactions.service");
let PaymentDoneController = class PaymentDoneController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async get(req) {
        try {
            const transactionCode = req.params["0"];
            if (transactionCode && transactionCode !== "") {
                return this.paymentDetails(transactionCode);
            }
            else {
                return {
                    invalidUrl: true,
                    title: "Payment incomplete",
                    cssFile: "/css/payment-done.css",
                    jsFile: "/js/payment-done.js",
                    layout: "layouts/main-layout",
                };
            }
        }
        catch (ex) {
            return {
                invalidUrl: true,
                title: "Payment incomplete",
                cssFile: "/css/payment-done.css",
                jsFile: "/js/payment-done.js",
                layout: "layouts/main-layout",
            };
        }
    }
    async getByCode(transactionCode) {
        try {
            if (transactionCode && transactionCode !== "") {
                return this.paymentDetails(transactionCode);
            }
            else {
                return {
                    invalidUrl: true,
                    title: "Payment incomplete",
                    cssFile: "/css/payment-done.css",
                    jsFile: "/js/payment-done.js",
                    layout: "layouts/main-layout",
                };
            }
        }
        catch (ex) {
            return {
                invalidUrl: true,
                title: "Payment incomplete",
                cssFile: "/css/payment-done.css",
                jsFile: "/js/payment-done.js",
                layout: "layouts/main-layout",
            };
        }
    }
    async paymentDetails(transactionCode) {
        var _a, _b, _c;
        try {
            let transaction = await this.transactionsService.getByCode(transactionCode);
            if (transaction &&
                (transaction === null || transaction === void 0 ? void 0 : transaction.paymentData) &&
                ((transaction === null || transaction === void 0 ? void 0 : transaction.status) !== payment_constant_1.PAYMENT_STATUS.COMPLETED ||
                    !(transaction === null || transaction === void 0 ? void 0 : transaction.isCompleted)) &&
                ((_a = transaction === null || transaction === void 0 ? void 0 : transaction.paymentData) === null || _a === void 0 ? void 0 : _a.paid)) {
                await this.transactionsService.comleteTopUpPayment(transaction === null || transaction === void 0 ? void 0 : transaction.transactionCode);
                transaction = await this.transactionsService.getByCode(transactionCode);
                return {
                    transaction,
                    title: "Payment success",
                    cssFile: "/css/payment-done.css",
                    jsFile: "/js/payment-done.js",
                    layout: "layouts/main-layout",
                };
            }
            else if (transaction &&
                (transaction === null || transaction === void 0 ? void 0 : transaction.paymentData) &&
                ((transaction === null || transaction === void 0 ? void 0 : transaction.status) === payment_constant_1.PAYMENT_STATUS.COMPLETED ||
                    (transaction === null || transaction === void 0 ? void 0 : transaction.isCompleted)) &&
                ((_b = transaction === null || transaction === void 0 ? void 0 : transaction.paymentData) === null || _b === void 0 ? void 0 : _b.paid)) {
                transaction = await this.transactionsService.getByCode(transactionCode);
                return {
                    transaction,
                    title: "Payment success",
                    cssFile: "/css/payment-done.css",
                    jsFile: "/js/payment-done.js",
                    layout: "layouts/main-layout",
                };
            }
            else if (transaction &&
                (transaction === null || transaction === void 0 ? void 0 : transaction.paymentData) &&
                !((_c = transaction === null || transaction === void 0 ? void 0 : transaction.paymentData) === null || _c === void 0 ? void 0 : _c.paid)) {
                await this.transactionsService.expirePaymentLink(transaction === null || transaction === void 0 ? void 0 : transaction.referenceCode);
                return {
                    transaction,
                    title: "Payment incomplete",
                    cssFile: "/css/payment-done.css",
                    jsFile: "/js/payment-done.js",
                    layout: "layouts/main-layout",
                };
            }
            else {
                return {
                    transaction,
                    title: "Payment incomplete",
                    cssFile: "/css/payment-done.css",
                    jsFile: "/js/payment-done.js",
                    layout: "layouts/main-layout",
                };
            }
        }
        catch (ex) {
            return {
                invalidUrl: true,
                title: "Payment incomplete",
                cssFile: "/css/payment-done.css",
                jsFile: "/js/payment-done.js",
                layout: "layouts/main-layout",
            };
        }
    }
};
__decorate([
    (0, common_1.Get)(""),
    (0, common_1.Render)("payment-done"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentDoneController.prototype, "get", null);
__decorate([
    (0, common_1.Get)("/:transactionCode"),
    (0, common_1.Render)("payment-done"),
    __param(0, (0, common_1.Param)("transactionCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentDoneController.prototype, "getByCode", null);
PaymentDoneController = __decorate([
    (0, common_1.Controller)({
        path: "payment-done",
    }),
    (0, swagger_1.ApiExcludeController)(),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], PaymentDoneController);
exports.PaymentDoneController = PaymentDoneController;
//# sourceMappingURL=payment-done.controller.js.map