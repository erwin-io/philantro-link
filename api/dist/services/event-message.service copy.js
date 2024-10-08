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
exports.EventMessageService = void 0;
const user_error_constant_1 = require("./../common/constant/user-error.constant");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const EventMessage_1 = require("../db/entities/EventMessage");
const typeorm_2 = require("typeorm");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const utils_1 = require("../common/utils/utils");
const Events_1 = require("../db/entities/Events");
const events_constant_1 = require("../common/constant/events.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const notifications_constant_1 = require("../common/constant/notifications.constant");
const Notifications_1 = require("../db/entities/Notifications");
const Users_1 = require("../db/entities/Users");
let EventMessageService = class EventMessageService {
    constructor(eventMessageRepo, oneSignalNotificationService) {
        this.eventMessageRepo = eventMessageRepo;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.eventMessageRepo.find({
                where: condition,
                relations: {
                    event: {
                        eventImages: {
                            user: true,
                            file: true,
                        },
                        user: {
                            userProfilePic: {
                                file: true,
                            },
                        },
                    },
                    toUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    fromUser: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
                skip,
                take,
                order,
            }),
            this.eventMessageRepo.count({
                where: condition,
            }),
        ]);
        return {
            results: results.map((x) => {
                var _a, _b, _c, _d, _e, _f;
                (_a = x.toUser) === null || _a === void 0 ? true : delete _a.password;
                (_b = x.fromUser) === null || _b === void 0 ? true : delete _b.password;
                (_d = (_c = x.event) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? true : delete _d.password;
                if ((_e = x.event) === null || _e === void 0 ? void 0 : _e.eventImages) {
                    x.event.eventImages = (_f = x.event) === null || _f === void 0 ? void 0 : _f.eventImages.map((i) => {
                        var _a;
                        (_a = i.user) === null || _a === void 0 ? true : delete _a.password;
                        return i;
                    });
                }
                return x;
            }),
            total,
        };
    }
    async getById(id) {
        return this.eventMessageRepo.findOne({
            where: {
                eventMessageId: id,
            },
            relations: {
                event: {
                    eventImages: {
                        user: true,
                        file: true,
                    },
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                },
                toUser: {
                    userProfilePic: {
                        file: true,
                    },
                },
                fromUser: {
                    userProfilePic: {
                        file: true,
                    },
                },
            },
        });
    }
    async create(dto) {
        try {
            return await this.eventMessageRepo.manager.transaction(async (entityManager) => {
                var _a, _b, _c, _d, _e, _f, _g;
                let eventMessage = new EventMessage_1.EventMessage();
                const event = await entityManager.findOne(Events_1.Events, {
                    where: {
                        eventCode: dto.eventCode,
                    },
                    relations: {
                        eventImages: {
                            user: {
                                userProfilePic: {
                                    file: true,
                                },
                            },
                            file: true,
                        },
                        user: {
                            userProfilePic: {
                                file: true,
                            },
                        },
                    },
                });
                if (!event) {
                    throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
                }
                eventMessage.event = event;
                eventMessage.message = dto.message;
                const fromUser = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userCode: dto.fromUserCode,
                    },
                });
                eventMessage.fromUser = fromUser;
                if (!fromUser) {
                    throw new Error(`Sender ${user_error_constant_1.USER_ERROR_USER_NOT_FOUND}`);
                }
                const toUser = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userCode: dto.toUserCode,
                    },
                });
                if (!toUser) {
                    throw new Error(`Recipient ${user_error_constant_1.USER_ERROR_USER_NOT_FOUND}`);
                }
                eventMessage.toUser = toUser;
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                eventMessage.dateTimeSent = timestamp;
                eventMessage = await entityManager.save(EventMessage_1.EventMessage, eventMessage);
                eventMessage = await entityManager.findOne(EventMessage_1.EventMessage, {
                    where: {
                        eventMessageId: eventMessage.eventMessageId,
                    },
                    relations: {
                        event: {
                            eventImages: {
                                user: true,
                                file: true,
                            },
                            user: {
                                userProfilePic: {
                                    file: true,
                                },
                            },
                        },
                        toUser: {
                            userProfilePic: {
                                file: true,
                            },
                        },
                        fromUser: {
                            userProfilePic: {
                                file: true,
                            },
                        },
                    },
                });
                const title = fromUser.name;
                const desc = eventMessage.message;
                const pushNotifResults = await Promise.all([
                    this.oneSignalNotificationService.sendToExternalUser((_a = eventMessage === null || eventMessage === void 0 ? void 0 : eventMessage.toUser) === null || _a === void 0 ? void 0 : _a.userCode, notifications_constant_1.NOTIF_TYPE.EVENTS, desc, [], title, eventMessage.message),
                ]);
                console.log(pushNotifResults);
                (_b = eventMessage.toUser) === null || _b === void 0 ? true : delete _b.password;
                (_c = eventMessage.fromUser) === null || _c === void 0 ? true : delete _c.password;
                (_e = (_d = eventMessage.event) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? true : delete _e.password;
                if ((_f = eventMessage.event) === null || _f === void 0 ? void 0 : _f.eventImages) {
                    eventMessage.event.eventImages =
                        (_g = eventMessage.event) === null || _g === void 0 ? void 0 : _g.eventImages.map((i) => {
                            var _a;
                            (_a = i.user) === null || _a === void 0 ? true : delete _a.password;
                            return i;
                        });
                }
                return eventMessage;
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
                referenceId: data.eventMessageId.toString(),
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
EventMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(EventMessage_1.EventMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        one_signal_notification_service_1.OneSignalNotificationService])
], EventMessageService);
exports.EventMessageService = EventMessageService;
//# sourceMappingURL=event-message.service%20copy.js.map