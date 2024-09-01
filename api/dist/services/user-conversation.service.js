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
exports.UserConversationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const UserConversation_1 = require("../db/entities/UserConversation");
const typeorm_2 = require("typeorm");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const utils_1 = require("../common/utils/utils");
const Events_1 = require("../db/entities/Events");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const Notifications_1 = require("../db/entities/Notifications");
const user_conversation_constant_1 = require("../common/constant/user-conversation.constant");
const SupportTicket_1 = require("../db/entities/SupportTicket");
const EventMessage_1 = require("../db/entities/EventMessage");
let UserConversationService = class UserConversationService {
    constructor(userConversationRepo, eventsRepo, eventMessageRepo, supportTicketRepo, oneSignalNotificationService) {
        this.userConversationRepo = userConversationRepo;
        this.eventsRepo = eventsRepo;
        this.eventMessageRepo = eventMessageRepo;
        this.supportTicketRepo = supportTicketRepo;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        try {
            const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
            const take = Number(pageSize);
            const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
            const [results, total] = await Promise.all([
                this.userConversationRepo.find({
                    where: condition,
                    relations: {
                        fromUser: true,
                        toUser: true,
                    },
                    skip,
                    take,
                    order,
                }),
                this.userConversationRepo.count({
                    where: condition,
                }),
            ]);
            const queryUnReadEventMessage = results
                .filter((x) => x.type === "EVENTS")
                .map((x) => {
                var _a, _b;
                return `
          SELECT ${x.userConversationId} as "userConversationId", e."EventCode" as "referenceId", COUNT("EventMessageId") 
          FROM dbo."EventMessage" em
          LEFT JOIN dbo."Events" e ON em."EventId" = e."EventId"
          WHERE e."EventCode" = '${x.referenceId}' AND em."FromUserId" =${(_a = x.toUser) === null || _a === void 0 ? void 0 : _a.userId} AND em."ToUserId" = ${(_b = x.fromUser) === null || _b === void 0 ? void 0 : _b.userId} AND em."Status" IN('SENT', 'DELIVERED') GROUP BY e."EventCode"`;
            })
                .join(" UNION ALL ");
            const referenceRes = await Promise.all([
                this.eventsRepo.find({
                    where: {
                        eventCode: (0, typeorm_2.In)(results.map((x) => x.referenceId)),
                    },
                    relations: {
                        user: true,
                    },
                }),
                this.supportTicketRepo.find({
                    where: {
                        supportTicketCode: (0, typeorm_2.In)(results.map((x) => x.referenceId)),
                    },
                    relations: {
                        user: true,
                    },
                }),
                this.eventMessageRepo.query(queryUnReadEventMessage).then((res) => {
                    return res.map((e) => {
                        return {
                            userConversationId: e["userConversationId"],
                            referenceId: e["referenceId"],
                            count: e["count"],
                        };
                    });
                }),
            ]);
            return {
                results: results.map((x) => {
                    var _a, _b, _c;
                    (_a = x.fromUser) === null || _a === void 0 ? true : delete _a.password;
                    (_b = x.toUser) === null || _b === void 0 ? true : delete _b.password;
                    if (x.type === user_conversation_constant_1.USER_CONVERSATION_TYPE.EVENTS) {
                        return Object.assign(Object.assign({}, x), { event: referenceRes[0].find((e) => e.eventCode === x.referenceId), unReadMessage: (_c = referenceRes[2].find((e) => e.userConversationId.toString() ===
                                x.userConversationId.toString())) === null || _c === void 0 ? void 0 : _c.count });
                    }
                    else {
                        return Object.assign(Object.assign({}, x), { supportTicket: referenceRes[1].find((s) => s.supportTicketCode === x.referenceId) });
                    }
                }),
                total,
            };
        }
        catch (ex) {
            throw ex;
        }
    }
    async getById(userConversationId) {
        try {
            const result = await this.userConversationRepo.findOne({
                where: {
                    userConversationId,
                },
                relations: {
                    fromUser: true,
                    toUser: true,
                },
            });
            if (result.type === user_conversation_constant_1.USER_CONVERSATION_TYPE.EVENTS) {
                const event = await this.eventsRepo.findOne({
                    where: {
                        eventCode: result.referenceId,
                    },
                    relations: {
                        user: true,
                    },
                });
                return Object.assign(Object.assign({}, result), { event });
            }
            else {
                const supportTicket = await this.supportTicketRepo.findOne({
                    where: {
                        supportTicketCode: result.referenceId,
                    },
                    relations: {
                        user: true,
                    },
                });
                return Object.assign(Object.assign({}, result), { supportTicket });
            }
        }
        catch (ex) {
            throw ex;
        }
    }
    async getUnreadByUser(userId) {
        return this.userConversationRepo.count({
            where: {
                fromUser: {
                    userId,
                    active: true,
                },
                active: true,
                status: (0, typeorm_2.In)(["SENT", "DELIVERED"]),
            },
        });
    }
    async markAsRead(userConversationId) {
        try {
            return await this.userConversationRepo.manager.transaction(async (entityManager) => {
                var _a, _b, _c, _d;
                let userConversation = await entityManager.findOne(UserConversation_1.UserConversation, {
                    where: {
                        userConversationId,
                    },
                    relations: {
                        fromUser: true,
                        toUser: true,
                    },
                });
                userConversation.status = "SEEN";
                userConversation = await entityManager.save(UserConversation_1.UserConversation, userConversation);
                const event = await entityManager.findOne(Events_1.Events, {
                    where: { eventCode: userConversation === null || userConversation === void 0 ? void 0 : userConversation.referenceId },
                });
                await entityManager.query(`
            UPDATE dbo."EventMessage" set "Status" = 'SEEN' WHERE "EventId" = ${event.eventId} 
            AND "FromUserId" = ${(_a = userConversation === null || userConversation === void 0 ? void 0 : userConversation.toUser) === null || _a === void 0 ? void 0 : _a.userId} AND "ToUserId" = ${(_b = userConversation === null || userConversation === void 0 ? void 0 : userConversation.fromUser) === null || _b === void 0 ? void 0 : _b.userId}; 
            `);
                const unReadNotif = await entityManager.count(Notifications_1.Notifications, {
                    where: {
                        user: {
                            userId: (_c = userConversation === null || userConversation === void 0 ? void 0 : userConversation.fromUser) === null || _c === void 0 ? void 0 : _c.userId,
                            active: true,
                        },
                        isRead: false,
                    },
                });
                const unReadMessage = await entityManager.count(UserConversation_1.UserConversation, {
                    where: {
                        fromUser: {
                            userId: (_d = userConversation === null || userConversation === void 0 ? void 0 : userConversation.fromUser) === null || _d === void 0 ? void 0 : _d.userId,
                            active: true,
                        },
                        status: (0, typeorm_2.In)(["SENT", "DELIVERED"]),
                        active: true,
                    },
                });
                const totalUnreadNotif = Number(unReadNotif) + Number(unReadMessage);
                return Object.assign(Object.assign({}, userConversation), { totalUnreadNotif });
            });
        }
        catch (ex) {
            throw ex;
        }
    }
    async logNotification(users, data, entityManager, title, description) {
        const notifications = [];
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.MESSAGE.toString(),
                referenceId: data.userConversationId.toString(),
                isRead: false,
                user: user,
            });
        }
        const res = await entityManager.save(Notifications_1.Notifications, notifications);
        return await entityManager.find(Notifications_1.Notifications, {
            where: {
                notificationId: (0, typeorm_2.In)(notifications.map((x) => x.notificationId)),
            },
            relations: {
                user: true,
            },
        });
    }
};
UserConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(UserConversation_1.UserConversation)),
    __param(1, (0, typeorm_1.InjectRepository)(Events_1.Events)),
    __param(2, (0, typeorm_1.InjectRepository)(EventMessage_1.EventMessage)),
    __param(3, (0, typeorm_1.InjectRepository)(SupportTicket_1.SupportTicket)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        one_signal_notification_service_1.OneSignalNotificationService])
], UserConversationService);
exports.UserConversationService = UserConversationService;
//# sourceMappingURL=user-conversation.service.js.map