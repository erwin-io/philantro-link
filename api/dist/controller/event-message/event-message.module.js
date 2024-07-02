"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMessageModule = void 0;
const common_1 = require("@nestjs/common");
const event_message_controller_1 = require("./event-message.controller");
const event_message_service_1 = require("../../services/event-message.service");
const EventMessage_1 = require("../../db/entities/EventMessage");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
let EventMessageModule = class EventMessageModule {
};
EventMessageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([EventMessage_1.EventMessage]),
        ],
        controllers: [event_message_controller_1.EventMessageController],
        providers: [event_message_service_1.EventMessageService, one_signal_notification_service_1.OneSignalNotificationService],
        exports: [event_message_service_1.EventMessageService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], EventMessageModule);
exports.EventMessageModule = EventMessageModule;
//# sourceMappingURL=event-message.module.js.map