"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketModule = void 0;
const common_1 = require("@nestjs/common");
const support_ticket_controller_1 = require("./support-ticket.controller");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
const SupportTicket_1 = require("../../db/entities/SupportTicket");
const support_ticket_service_1 = require("../../services/support-ticket.service");
const SupportTicketMessage_1 = require("../../db/entities/SupportTicketMessage");
const UserConversation_1 = require("../../db/entities/UserConversation");
let SupportTicketModule = class SupportTicketModule {
};
SupportTicketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                SupportTicket_1.SupportTicket,
                SupportTicketMessage_1.SupportTicketMessage,
                UserConversation_1.UserConversation,
            ]),
        ],
        controllers: [support_ticket_controller_1.SupportTicketController],
        providers: [support_ticket_service_1.SupportTicketService, one_signal_notification_service_1.OneSignalNotificationService],
        exports: [support_ticket_service_1.SupportTicketService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], SupportTicketModule);
exports.SupportTicketModule = SupportTicketModule;
//# sourceMappingURL=support-ticket.module.js.map