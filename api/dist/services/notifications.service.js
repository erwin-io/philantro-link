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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const utils_1 = require("../common/utils/utils");
const Notifications_1 = require("../db/entities/Notifications");
const typeorm_2 = require("typeorm");
const pusher_service_1 = require("./pusher.service");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const UserConversation_1 = require("../db/entities/UserConversation");
let NotificationsService = class NotificationsService {
    constructor(notificationsRepo, pusherService, oneSignalNotificationService) {
        this.notificationsRepo = notificationsRepo;
        this.pusherService = pusherService;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.notificationsRepo.find({
                where: condition,
                skip,
                take,
                order,
                relations: {
                    user: true,
                },
            }),
            this.notificationsRepo.count({
                where: condition,
            }),
        ]);
        return {
            results,
            total,
        };
    }
    async markAsRead(notificationId) {
        return await this.notificationsRepo.manager.transaction(async (entityManager) => {
            let notification = await entityManager.findOne(Notifications_1.Notifications, {
                where: {
                    notificationId,
                },
                relations: {
                    user: true,
                },
            });
            notification.isRead = true;
            notification = await entityManager.save(Notifications_1.Notifications, notification);
            const unReadNotif = await entityManager.count(Notifications_1.Notifications, {
                where: {
                    user: {
                        userId: notification.user.userId,
                        active: true,
                    },
                    isRead: false,
                },
            });
            const unReadMessage = await entityManager.count(UserConversation_1.UserConversation, {
                where: {
                    fromUser: {
                        userId: notification.user.userId,
                        active: true,
                    },
                    active: true,
                    status: (0, typeorm_2.In)(["SENT", "DELIVERED"]),
                },
            });
            const totalUnreadNotif = Number(unReadNotif) + Number(unReadMessage);
            return Object.assign(Object.assign({}, notification), { totalUnreadNotif });
        });
    }
    async getUnreadByUser(userId) {
        return this.notificationsRepo.count({
            where: {
                user: {
                    userId,
                    active: true,
                },
                isRead: false,
            },
        });
    }
};
NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Notifications_1.Notifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pusher_service_1.PusherService,
        one_signal_notification_service_1.OneSignalNotificationService])
], NotificationsService);
exports.NotificationsService = NotificationsService;
//# sourceMappingURL=notifications.service.js.map