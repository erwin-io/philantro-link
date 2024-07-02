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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const moment_1 = __importDefault(require("moment"));
const user_error_constant_1 = require("../common/constant/user-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const utils_1 = require("../common/utils/utils");
const Events_1 = require("../db/entities/Events");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const events_constant_1 = require("../common/constant/events.constant");
const date_constant_1 = require("../common/constant/date.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const Interested_1 = require("../db/entities/Interested");
const Responded_1 = require("../db/entities/Responded");
const payment_constant_1 = require("../common/constant/payment.constant");
let EventsService = class EventsService {
    constructor(eventRepo, oneSignalNotificationService) {
        this.eventRepo = eventRepo;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.eventRepo.find({
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
                    eventImages: {
                        file: true,
                    },
                },
            }),
            this.eventRepo.count({
                where: Object.assign({}, condition),
            }),
        ]);
        return {
            results: results.map((res) => {
                var _a;
                (_a = res.user) === null || _a === void 0 ? true : delete _a.password;
                return Object.assign({}, res);
            }),
            total,
        };
    }
    async getByCode(eventCode = "", currentUserCode = "") {
        var _a, _b;
        const result = await this.eventRepo.findOne({
            where: {
                eventCode: (_a = eventCode === null || eventCode === void 0 ? void 0 : eventCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
            },
            relations: {
                user: {
                    userProfilePic: {
                        file: true,
                    },
                },
                eventImages: {
                    file: true,
                },
            },
        });
        if (!result) {
            throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
        }
        const interested = await this.eventRepo
            .query(`SELECT COUNT("EventId") FROM dbo."Interested" WHERE "EventId" = ${result.eventId}`)
            .then((res) => {
            var _a;
            return res[0] ? (_a = res[0]["count"]) !== null && _a !== void 0 ? _a : 0 : 0;
        });
        const responded = await this.eventRepo
            .query(`SELECT COUNT("EventId") FROM dbo."Responded" WHERE "EventId" = ${result.eventId}`)
            .then((res) => {
            var _a;
            return res[0] ? (_a = res[0]["count"]) !== null && _a !== void 0 ? _a : 0 : 0;
        });
        let raisedDonation = 0;
        raisedDonation = await this.eventRepo
            .query(`SELECT SUM("Amount") FROM dbo."Transactions" WHERE "Status" = 'COMPLETED' AND "EventId" = ${result.eventId}`)
            .then((res) => {
            var _a;
            return res[0] ? (_a = res[0]["sum"]) !== null && _a !== void 0 ? _a : 0 : 0;
        });
        let isCurrentUserInterested = false;
        let isCurrentUserResponded = false;
        if (currentUserCode && currentUserCode !== "") {
            const interestedCount = await this.eventRepo.manager.count(Interested_1.Interested, {
                where: {
                    user: {
                        userCode: currentUserCode,
                    },
                    event: {
                        eventCode: result.eventCode,
                    },
                },
            });
            isCurrentUserInterested = interestedCount > 0;
            const respondedCount = await this.eventRepo.manager.count(Responded_1.Responded, {
                where: {
                    user: {
                        userCode: currentUserCode,
                    },
                    event: {
                        eventCode: result.eventCode,
                    },
                },
            });
            isCurrentUserResponded = respondedCount > 0;
        }
        (_b = result.user) === null || _b === void 0 ? true : delete _b.password;
        return Object.assign(Object.assign({}, result), { interested,
            responded,
            raisedDonation,
            isCurrentUserResponded,
            isCurrentUserInterested });
    }
    async createCharityVolunteerEvent(dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = new Events_1.Events();
            event.eventType = dto.eventType;
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            const dateTime = (0, moment_1.default)(new Date(dto.dateTime), date_constant_1.DateConstant.DATE_LANGUAGE).toISOString();
            event.dateTime = new Date(dateTime);
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
            event.user = user;
            event.eventStatus = events_constant_1.EVENT_STATUS.PENDING;
            event = await entityManager.save(event);
            event.eventCode = (0, utils_1.generateIndentityCode)(event.eventId);
            event = await entityManager.save(event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async createDonationEvent(dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = new Events_1.Events();
            event.eventType = events_constant_1.EVENT_TYPE.DONATION;
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            event.transferType = dto.transferType;
            event.transferAccountNumber = dto.transferAccountNumber;
            event.transferAccountName = dto.transferAccountName;
            const dateTime = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTime = dateTime;
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
            event.user = user;
            event.eventStatus = events_constant_1.EVENT_STATUS.PENDING;
            event = await entityManager.save(event);
            event.eventCode = (0, utils_1.generateIndentityCode)(event.eventId);
            event = await entityManager.save(event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async createAssistanceEvent(dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = new Events_1.Events();
            event.eventType = events_constant_1.EVENT_TYPE.ASSISTANCE;
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            const dateTime = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTime = dateTime;
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
            event.user = user;
            event.eventStatus = events_constant_1.EVENT_STATUS.PENDING;
            event = await entityManager.save(event);
            event.eventCode = (0, utils_1.generateIndentityCode)(event.eventId);
            event = await entityManager.save(event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async updateCharityVolunteerEvent(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            event = await entityManager.save(Events_1.Events, event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async updateDonationEvent(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            if (!dto.transferType ||
                dto.transferType === "" ||
                ![payment_constant_1.PAYMENT_METHOD.CARD, payment_constant_1.PAYMENT_METHOD.CASH, payment_constant_1.PAYMENT_METHOD.WALLET].some((x) => { var _a; return x === ((_a = dto.transferType) === null || _a === void 0 ? void 0 : _a.toUpperCase()); })) {
                throw new Error("Invalid transfer type!");
            }
            event.transferType = dto.transferType;
            event.transferAccountNumber = dto.transferAccountNumber;
            event.transferAccountName = dto.transferAccountName;
            event = await entityManager.save(Events_1.Events, event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async updateAssistanceEvent(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            event = await entityManager.save(Events_1.Events, event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async updateStatus(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a;
            let event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if ((event.eventStatus !== events_constant_1.EVENT_STATUS.PENDING &&
                event.eventStatus !== events_constant_1.EVENT_STATUS.APPROVED &&
                !event.inProgress) ||
                dto.status === event.eventStatus) {
                throw new Error("The event was already: " + event.eventStatus.toLocaleLowerCase());
            }
            if ((dto.status === events_constant_1.EVENT_STATUS.INPROGRESS &&
                event.eventStatus === events_constant_1.EVENT_STATUS.PENDING) ||
                (dto.status === events_constant_1.EVENT_STATUS.COMPLETED &&
                    event.eventStatus === events_constant_1.EVENT_STATUS.PENDING)) {
                throw new Error("The event was not yet approved!");
            }
            if (dto.status === events_constant_1.EVENT_STATUS.COMPLETED && !event.inProgress) {
                throw new Error("The event was not yet started!");
            }
            event.eventStatus = dto.status;
            event = await entityManager.save(Events_1.Events, event);
            event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventId: event.eventId,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async updateEventInterested(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c;
            const event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            const user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.userCode,
                },
                relations: {},
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            let interested = await entityManager.findOne(Interested_1.Interested, {
                where: {
                    user: {
                        userCode: dto.userCode,
                    },
                    event: {
                        eventCode: eventCode,
                    },
                },
                relations: {},
            });
            let interestedCount = await this.eventRepo
                .query(`SELECT COUNT("EventId") FROM dbo."Interested" WHERE "EventId" = ${event.eventId}`)
                .then((res) => {
                var _a;
                return res[0] ? (_a = res[0]["count"]) !== null && _a !== void 0 ? _a : 0 : 0;
            });
            if (!interested &&
                user.userCode !== ((_a = event.user) === null || _a === void 0 ? void 0 : _a.userCode) &&
                user.userType === user_type_constant_1.USER_TYPE.CLIENT) {
                interested = new Interested_1.Interested();
                interested.event = event;
                interested.user = user;
                interested = await entityManager.save(Interested_1.Interested, interested);
                interestedCount = Number(interestedCount) + 1;
            }
            (_b = event.user) === null || _b === void 0 ? true : delete _b.password;
            (_c = event.user) === null || _c === void 0 ? true : delete _c.password;
            return Object.assign(Object.assign({}, event), { interested: interestedCount });
        });
    }
    async updateEventResponded(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c;
            const event = await entityManager.findOne(Events_1.Events, {
                where: {
                    eventCode,
                },
                relations: {
                    user: {
                        userProfilePic: {
                            file: true,
                        },
                    },
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            const user = await entityManager.findOne(Users_1.Users, {
                where: {
                    userCode: dto.userCode,
                },
                relations: {},
            });
            if (!user) {
                throw Error(user_error_constant_1.USER_ERROR_USER_NOT_FOUND);
            }
            let responded = await entityManager.findOne(Responded_1.Responded, {
                where: {
                    user: {
                        userCode: dto.userCode,
                    },
                    event: {
                        eventCode: eventCode,
                    },
                },
                relations: {},
            });
            let respondedCount = await this.eventRepo
                .query(`SELECT COUNT("EventId") FROM dbo."Responded" WHERE "EventId" = ${event.eventId}`)
                .then((res) => {
                var _a;
                return res[0] ? (_a = res[0]["count"]) !== null && _a !== void 0 ? _a : 0 : 0;
            });
            if (!responded &&
                user.userCode !== ((_a = event.user) === null || _a === void 0 ? void 0 : _a.userCode) &&
                user.userType === user_type_constant_1.USER_TYPE.CLIENT) {
                responded = new Responded_1.Responded();
                responded.event = event;
                responded.user = user;
                responded = await entityManager.save(Responded_1.Responded, responded);
                respondedCount = Number(respondedCount) + 1;
            }
            (_b = event.user) === null || _b === void 0 ? true : delete _b.password;
            (_c = event.user) === null || _c === void 0 ? true : delete _c.password;
            return Object.assign(Object.assign({}, event), { responded: respondedCount });
        });
    }
};
EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Events_1.Events)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        one_signal_notification_service_1.OneSignalNotificationService])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service%20copy.js.map