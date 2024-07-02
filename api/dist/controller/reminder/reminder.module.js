"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderModule = void 0;
const common_1 = require("@nestjs/common");
const reminder_controller_1 = require("./reminder.controller");
const reminder_service_1 = require("../../services/reminder.service");
const typeorm_1 = require("@nestjs/typeorm");
const pusher_service_1 = require("../../services/pusher.service");
const one_signal_notification_service_1 = require("../../services/one-signal-notification.service");
const axios_1 = require("@nestjs/axios");
const Notifications_1 = require("../../db/entities/Notifications");
let ReminderModule = class ReminderModule {
};
ReminderModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([Notifications_1.Notifications])],
        controllers: [reminder_controller_1.ReminderController],
        providers: [reminder_service_1.ReminderService, pusher_service_1.PusherService, one_signal_notification_service_1.OneSignalNotificationService],
        exports: [reminder_service_1.ReminderService, pusher_service_1.PusherService, one_signal_notification_service_1.OneSignalNotificationService],
    })
], ReminderModule);
exports.ReminderModule = ReminderModule;
//# sourceMappingURL=reminder.module.js.map