"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDoneModule = void 0;
const common_1 = require("@nestjs/common");
const payment_done_controller_1 = require("./payment-done.controller");
const transactions_service_1 = require("../../services/transactions.service");
const Transactions_1 = require("../../db/entities/Transactions");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
let PaymentDoneModule = class PaymentDoneModule {
};
PaymentDoneModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([Transactions_1.Transactions]),
        ],
        controllers: [payment_done_controller_1.PaymentDoneController],
        providers: [transactions_service_1.TransactionsService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], PaymentDoneModule);
exports.PaymentDoneModule = PaymentDoneModule;
//# sourceMappingURL=payment-done.module.js.map