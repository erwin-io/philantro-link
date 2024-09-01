"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConversationModule = void 0;
const common_1 = require("@nestjs/common");
const user_conversation_controller_1 = require("./user-conversation.controller");
const user_conversation_service_1 = require("../../services/user-conversation.service");
const UserConversation_1 = require("../../db/entities/UserConversation");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
const SupportTicket_1 = require("../../db/entities/SupportTicket");
const Events_1 = require("../../db/entities/Events");
const EventMessage_1 = require("../../db/entities/EventMessage");
let UserConversationModule = class UserConversationModule {
};
UserConversationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                UserConversation_1.UserConversation,
                Events_1.Events,
                SupportTicket_1.SupportTicket,
                EventMessage_1.EventMessage,
            ]),
        ],
        controllers: [user_conversation_controller_1.UserConversationController],
        providers: [user_conversation_service_1.UserConversationService, one_signal_notification_service_1.OneSignalNotificationService],
        exports: [user_conversation_service_1.UserConversationService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], UserConversationModule);
exports.UserConversationModule = UserConversationModule;
//# sourceMappingURL=user-conversation.module.js.map