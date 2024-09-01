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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportTicketService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const user_error_constant_1 = require("../common/constant/user-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const utils_1 = require("../common/utils/utils");
const SupportTicket_1 = require("../db/entities/SupportTicket");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const support_ticket_constant_1 = require("../common/constant/support-ticket.constant");
const date_constant_1 = require("../common/constant/date.constant");
const SupportTicketMessage_1 = require("../db/entities/SupportTicketMessage");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const Notifications_1 = require("../db/entities/Notifications");
const UserConversation_1 = require("../db/entities/UserConversation");
const user_conversation_constant_1 = require("../common/constant/user-conversation.constant");
let SupportTicketService = class SupportTicketService {
    constructor(supportTicketRepo, supportTicketMessageRepo, userConversationRepo, oneSignalNotificationService) {
        this.supportTicketRepo = supportTicketRepo;
        this.supportTicketMessageRepo = supportTicketMessageRepo;
        this.userConversationRepo = userConversationRepo;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.supportTicketRepo.find({
                where: Object.assign({}, condition),
                skip,
                take,
                order,
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            }),
            this.supportTicketRepo.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results: results.map((res) => {
                var _a, _b;
                (_a = res.assignedAdminUser) === null || _a === void 0 ? true : delete _a.password;
                (_b = res.user) === null || _b === void 0 ? true : delete _b.password;
                return Object.assign({}, res);
            }),
            total,
        };
    }
    async getByCode(supportTicketCode = "", currentUserCode = "") {
        var _a, _b, _c;
        const [result, userConversation] = await Promise.all([
            this.supportTicketRepo.findOne({
                where: {
                    supportTicketCode: (_a = supportTicketCode === null || supportTicketCode === void 0 ? void 0 : supportTicketCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            }),
            currentUserCode
                ? this.userConversationRepo.findOne({
                    where: {
                        referenceId: supportTicketCode,
                        fromUser: {
                            userCode: currentUserCode,
                        },
                        type: user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET,
                    },
                    relations: {
                        fromUser: true,
                        toUser: true,
                    },
                })
                : Promise.resolve(null),
        ]);
        if (!result) {
            throw Error(support_ticket_constant_1.SUPPORT_TICKET_ERROR_NOT_FOUND);
        }
        (_b = result.assignedAdminUser) === null || _b === void 0 ? true : delete _b.password;
        (_c = result.user) === null || _c === void 0 ? true : delete _c.password;
        return Object.assign(Object.assign({}, result), { userConversation });
    }
    async createSupportTicket(dto) {
        return await this.supportTicketRepo.manager.transaction(async (entityManager) => {
            var _a, _b;
            let supportTicket = new SupportTicket_1.SupportTicket();
            supportTicket.type = dto.type;
            supportTicket.title = dto.title;
            supportTicket.description = dto.description;
            const dateTimeSent = (0, moment_1.default)(new Date(dto.dateTimeSent), date_constant_1.DateConstant.DATE_LANGUAGE).toISOString();
            supportTicket.dateTimeSent = new Date(dateTimeSent);
            const user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.userCode,
                    userType: user_type_constant_1.USER_TYPE.CLIENT,
                    active: true,
                },
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            supportTicket.user = user;
            supportTicket.status = support_ticket_constant_1.SUPPORT_TICKET_STATUS.OPEN;
            supportTicket = await entityManager.save(supportTicket);
            supportTicket.supportTicketCode = (0, utils_1.generateIndentityCode)(supportTicket.supportTicketId);
            supportTicket = await entityManager.save(supportTicket);
            supportTicket = await entityManager.findOne(SupportTicket_1.SupportTicket, {
                where: {
                    supportTicketId: supportTicket.supportTicketId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (!supportTicket) {
                throw Error(support_ticket_constant_1.SUPPORT_TICKET_ERROR_NOT_FOUND);
            }
            (_a = supportTicket.user) === null || _a === void 0 ? true : delete _a.password;
            (_b = supportTicket.assignedAdminUser) === null || _b === void 0 ? true : delete _b.password;
            return supportTicket;
        });
    }
    async updateSupportTicket(supportTicketCode, dto) {
        return await this.supportTicketRepo.manager.transaction(async (entityManager) => {
            var _a, _b;
            let supportTicket = await entityManager.findOne(SupportTicket_1.SupportTicket, {
                where: {
                    supportTicketCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            supportTicket.title = dto.title;
            supportTicket.description = dto.description;
            supportTicket = await entityManager.save(SupportTicket_1.SupportTicket, supportTicket);
            supportTicket = await entityManager.findOne(SupportTicket_1.SupportTicket, {
                where: {
                    supportTicketId: supportTicket.supportTicketId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (!supportTicket) {
                throw Error(support_ticket_constant_1.SUPPORT_TICKET_ERROR_NOT_FOUND);
            }
            (_a = supportTicket.user) === null || _a === void 0 ? true : delete _a.password;
            (_b = supportTicket.assignedAdminUser) === null || _b === void 0 ? true : delete _b.password;
            return supportTicket;
        });
    }
    async updateStatus(supportTicketCode, dto) {
        return await this.supportTicketRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d;
            let supportTicket = await entityManager.findOne(SupportTicket_1.SupportTicket, {
                where: {
                    supportTicketCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            supportTicket.status = dto.status;
            const assignedAdminUser = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.assignedAdminUserCode,
                    userType: user_type_constant_1.USER_TYPE.ADMIN,
                    active: true,
                },
            });
            if (!assignedAdminUser) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            supportTicket.assignedAdminUser = assignedAdminUser;
            supportTicket = await entityManager.save(SupportTicket_1.SupportTicket, supportTicket);
            supportTicket = await entityManager.findOne(SupportTicket_1.SupportTicket, {
                where: {
                    supportTicketId: supportTicket.supportTicketId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    assignedAdminUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (!supportTicket) {
                throw Error(support_ticket_constant_1.SUPPORT_TICKET_ERROR_NOT_FOUND);
            }
            const title = (support_ticket_constant_1.SUPPORT_TICKET_STATUS.ACTIVE
                ? `Your ticket #${supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode} is now active.`
                : "") ||
                (support_ticket_constant_1.SUPPORT_TICKET_STATUS.COMPLETED
                    ? `Your ticket #${supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode} has been completed.`
                    : "") ||
                (support_ticket_constant_1.SUPPORT_TICKET_STATUS.ACTIVE
                    ? `Your ticket #${supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode} has been closed.`
                    : "");
            const desc = (support_ticket_constant_1.SUPPORT_TICKET_STATUS.ACTIVE
                ? `Your ticket #${supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode} is now active. Our support team is currently working on resolving your issue.`
                : "") ||
                (support_ticket_constant_1.SUPPORT_TICKET_STATUS.COMPLETED
                    ? `Your ticket #${supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode} has been completed. Please review the resolution and let us know if you need further assistance.`
                    : "") ||
                (support_ticket_constant_1.SUPPORT_TICKET_STATUS.ACTIVE
                    ? `Your ticket #${supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode} has been closed. Thank you for your feedback. We’re here if you need anything else.`
                    : "");
            const clientNotifications = await this.logNotification([(_a = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user) === null || _a === void 0 ? void 0 : _a.userId], supportTicket, entityManager, title, desc);
            const pushNotif = await this.oneSignalNotificationService.sendToExternalUser((_b = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user) === null || _b === void 0 ? void 0 : _b.userName, notifications_constant_1.NOTIF_TYPE.SUPPORT_TICKET, supportTicket.supportTicketCode, clientNotifications, title, desc);
            console.log(pushNotif);
            (_c = supportTicket.user) === null || _c === void 0 ? true : delete _c.password;
            (_d = supportTicket.assignedAdminUser) === null || _d === void 0 ? true : delete _d.password;
            return supportTicket;
        });
    }
    async getMessagePagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.supportTicketMessageRepo.find({
                where: Object.assign({ active: true }, condition),
                skip,
                take,
                order,
                relations: {
                    fromUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    supportTicket: true,
                },
            }),
            this.supportTicketMessageRepo.count({
                where: Object.assign({ active: true }, condition),
            }),
        ]);
        return {
            results: results.map((res) => {
                var _a;
                (_a = res.fromUser) === null || _a === void 0 ? true : delete _a.password;
                return Object.assign({}, res);
            }),
            total,
        };
    }
    async postMessage(dto) {
        return await this.supportTicketMessageRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e, _f, _g;
            let supportTicketMessage = new SupportTicketMessage_1.SupportTicketMessage();
            supportTicketMessage.message = dto.message;
            const dateTimeSent = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            supportTicketMessage.dateTimeSent = new Date(dateTimeSent);
            const supportTicket = await entityManager.findOne(SupportTicket_1.SupportTicket, {
                where: {
                    supportTicketCode: dto.supportTicketCode,
                    active: true,
                },
                relations: {
                    user: true,
                    assignedAdminUser: true,
                },
            });
            if (!supportTicket) {
                throw Error(support_ticket_constant_1.SUPPORT_TICKET_ERROR_NOT_FOUND);
            }
            supportTicketMessage.supportTicket = supportTicket;
            let fromUser = null;
            let toUser = null;
            if (dto.userCode === supportTicket.user.userCode) {
                fromUser = supportTicket.user;
                toUser = supportTicket.assignedAdminUser;
            }
            else {
                fromUser = supportTicket.assignedAdminUser;
                toUser = supportTicket.user;
            }
            supportTicketMessage.fromUser = fromUser;
            supportTicketMessage = await entityManager.save(supportTicketMessage);
            supportTicketMessage = await entityManager.findOne(SupportTicketMessage_1.SupportTicketMessage, {
                where: {
                    supportTicketMessageId: supportTicketMessage.supportTicketMessageId,
                },
                relations: {
                    fromUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
            });
            if (!supportTicketMessage) {
                throw Error(support_ticket_constant_1.SUPPORT_TICKET_MESSAGE_ERROR_NOT_FOUND);
            }
            const senderIsAdmin = (supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser.userCode) ===
                supportTicketMessage.fromUser.userCode;
            if (senderIsAdmin) {
                let userConversation = await entityManager.findOne(UserConversation_1.UserConversation, {
                    where: {
                        fromUser: {
                            userCode: (_a = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser) === null || _a === void 0 ? void 0 : _a.userCode,
                        },
                        referenceId: supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode,
                        active: true,
                        type: user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET,
                    },
                });
                if (!userConversation) {
                    userConversation = new UserConversation_1.UserConversation();
                    userConversation.fromUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser;
                    userConversation.toUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user;
                    userConversation.referenceId = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode;
                    userConversation.type = user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET;
                }
                userConversation.title = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.title;
                userConversation.description = `You: ${supportTicketMessage === null || supportTicketMessage === void 0 ? void 0 : supportTicketMessage.message}`;
                userConversation = await entityManager.save(UserConversation_1.UserConversation, userConversation);
                userConversation = await entityManager.findOne(UserConversation_1.UserConversation, {
                    where: {
                        fromUser: {
                            userCode: (_b = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user) === null || _b === void 0 ? void 0 : _b.userCode,
                        },
                        referenceId: supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode,
                        active: true,
                        type: user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET,
                    },
                });
                if (!userConversation) {
                    userConversation = new UserConversation_1.UserConversation();
                    userConversation.fromUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user;
                    userConversation.toUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser;
                    userConversation.referenceId = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode;
                    userConversation.type = user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET;
                }
                userConversation.title = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.title;
                userConversation.description = `${(_c = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser) === null || _c === void 0 ? void 0 : _c.name}: ${supportTicketMessage === null || supportTicketMessage === void 0 ? void 0 : supportTicketMessage.message}`;
                userConversation = await entityManager.save(UserConversation_1.UserConversation, userConversation);
            }
            else {
                let userConversation = await entityManager.findOne(UserConversation_1.UserConversation, {
                    where: {
                        fromUser: {
                            userCode: (_d = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user) === null || _d === void 0 ? void 0 : _d.userCode,
                        },
                        referenceId: supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode,
                        active: true,
                        type: user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET,
                    },
                });
                if (!userConversation) {
                    userConversation = new UserConversation_1.UserConversation();
                    userConversation.fromUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user;
                    userConversation.toUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser;
                    userConversation.referenceId = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode;
                    userConversation.type = user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET;
                }
                userConversation.title = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.title;
                userConversation.description = `You: ${supportTicketMessage === null || supportTicketMessage === void 0 ? void 0 : supportTicketMessage.message}`;
                userConversation = await entityManager.save(UserConversation_1.UserConversation, userConversation);
                userConversation = await entityManager.findOne(UserConversation_1.UserConversation, {
                    where: {
                        fromUser: {
                            userCode: (_e = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user) === null || _e === void 0 ? void 0 : _e.userCode,
                        },
                        referenceId: supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode,
                        active: true,
                        type: user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET,
                    },
                });
                if (!userConversation) {
                    userConversation = new UserConversation_1.UserConversation();
                    userConversation.fromUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.assignedAdminUser;
                    userConversation.toUser = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user;
                    userConversation.referenceId = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.supportTicketCode;
                    userConversation.type = user_conversation_constant_1.USER_CONVERSATION_TYPE.SUPPORT_TICKET;
                }
                userConversation.title = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.title;
                userConversation.description = `${(_f = supportTicket === null || supportTicket === void 0 ? void 0 : supportTicket.user) === null || _f === void 0 ? void 0 : _f.name}: ${supportTicketMessage === null || supportTicketMessage === void 0 ? void 0 : supportTicketMessage.message}`;
                userConversation = await entityManager.save(UserConversation_1.UserConversation, userConversation);
            }
            const postMessage = await this.oneSignalNotificationService.sendToExternalUser(toUser === null || toUser === void 0 ? void 0 : toUser.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, supportTicketMessage.supportTicketMessageId, [], fromUser === null || fromUser === void 0 ? void 0 : fromUser.name, supportTicketMessage.message);
            console.log(postMessage);
            (_g = supportTicketMessage.fromUser) === null || _g === void 0 ? true : delete _g.password;
            return supportTicketMessage;
        });
    }
    async logNotification(userIds, data, entityManager, title, description) {
        const notifications = [];
        const users = await entityManager.find(Users_1.Users, {
            where: {
                userId: (0, typeorm_2.In)(userIds),
            },
        });
        for (const user of users) {
            notifications.push({
                title,
                description,
                type: notifications_constant_1.NOTIF_TYPE.SUPPORT_TICKET.toString(),
                referenceId: data.supportTicketCode.toString(),
                isRead: false,
                user: user,
            });
        }
        const res = await entityManager.save(Notifications_1.Notifications, notifications);
        return await entityManager.find(Notifications_1.Notifications, {
            where: {
                referenceId: data.supportTicketCode,
                user: {
                    userId: (0, typeorm_2.In)(userIds),
                },
            },
            relations: {
                user: true,
            },
        });
    }
};
SupportTicketService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(SupportTicket_1.SupportTicket)),
    __param(1, (0, typeorm_1.InjectRepository)(SupportTicketMessage_1.SupportTicketMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(UserConversation_1.UserConversation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        one_signal_notification_service_1.OneSignalNotificationService])
], SupportTicketService);
exports.SupportTicketService = SupportTicketService;
//# sourceMappingURL=support-ticket.service.js.map