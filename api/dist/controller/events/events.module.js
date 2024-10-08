"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_controller_1 = require("./events.controller");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
const Events_1 = require("../../db/entities/Events");
const events_service_1 = require("../../services/events.service");
const UserConversation_1 = require("../../db/entities/UserConversation");
const Notifications_1 = require("../../db/entities/Notifications");
const Transactions_1 = require("../../db/entities/Transactions");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                Events_1.Events,
                UserConversation_1.UserConversation,
                Notifications_1.Notifications,
                Transactions_1.Transactions,
            ]),
        ],
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService, one_signal_notification_service_1.OneSignalNotificationService],
        exports: [events_service_1.EventsService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map