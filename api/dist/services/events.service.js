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
const notifications_constant_1 = require("../common/constant/notifications.constant");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
const utils_1 = require("../common/utils/utils");
const Events_1 = require("../db/entities/Events");
const Notifications_1 = require("../db/entities/Notifications");
const Users_1 = require("../db/entities/Users");
const typeorm_2 = require("typeorm");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
const events_constant_1 = require("../common/constant/events.constant");
const date_constant_1 = require("../common/constant/date.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const Interested_1 = require("../db/entities/Interested");
const Responded_1 = require("../db/entities/Responded");
const payment_constant_1 = require("../common/constant/payment.constant");
const uuid_1 = require("uuid");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const Files_1 = require("../db/entities/Files");
const EventImage_1 = require("../db/entities/EventImage");
const path_1 = require("path");
const EventMessage_1 = require("../db/entities/EventMessage");
const UserConversation_1 = require("../db/entities/UserConversation");
const Transactions_1 = require("../db/entities/Transactions");
let EventsService = class EventsService {
    constructor(eventRepo, userConversationRepo, notificationsRepo, firebaseProvoder, oneSignalNotificationService) {
        this.eventRepo = eventRepo;
        this.userConversationRepo = userConversationRepo;
        this.notificationsRepo = notificationsRepo;
        this.firebaseProvoder = firebaseProvoder;
        this.oneSignalNotificationService = oneSignalNotificationService;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total, others] = await Promise.all([
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            }),
            this.eventRepo.count({
                where: Object.assign({}, condition),
            }),
            this.eventRepo
                .find({
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
            })
                .then(async (res) => {
                const otherQuery = `
          WITH records AS (select "EventId" as "eventId" from dbo."Events" WHERE "EventId" IN(${res.length > 0 ? res.map((x) => x.eventId).join(",") : 0})
            ),
      interested AS (
        SELECT
        "EventId" as "eventId",
        COALESCE(COUNT(*),0) AS total
        FROM
        dbo."Interested"
         group by "EventId"
      ),
      responded AS (
        SELECT
        "EventId" as "eventId",
        COALESCE(COUNT(*),0) AS total
        FROM
        dbo."Responded" 
        group by "EventId"
      ),
      donation AS (
        SELECT 
        "EventId" as "eventId",
        COALESCE(SUM("Amount"),0) as total
        FROM dbo."Transactions" 
        WHERE "Status" = 'COMPLETED'
        AND "IsCompleted" = true
        GROUP BY "EventId"

      ) select rec."eventId", 
       COALESCE(i.total, 0) as interested, 
       COALESCE(r.total, 0) as responded, 
       COALESCE(d.total, 0) as "raisedDonation" 
       from records rec 
       LEFT JOIn interested i ON rec."eventId" = i."eventId"
       LEFT JOIn responded r ON rec."eventId" = r."eventId"
       LEFT JOIn donation d ON rec."eventId" = d."eventId"
       `;
                return await this.eventRepo.query(otherQuery).then((_) => {
                    _.map((e) => {
                        return {
                            eventId: e["eventId"],
                            interested: e["interested"],
                            responded: e["responded"],
                            raisedDonation: e["raisedDonation"],
                        };
                    });
                    return _;
                });
            }),
        ]);
        return {
            results: results.map((res) => {
                var _a, _b, _c, _d;
                (_a = res.user) === null || _a === void 0 ? true : delete _a.password;
                return Object.assign(Object.assign({}, res), { eventImages: res.eventImages.filter((x) => x.active), interested: others.some((e) => e.eventId === res.eventId)
                        ? Number((_b = others.find((e) => e.eventId === res.eventId)) === null || _b === void 0 ? void 0 : _b.interested)
                        : 0, responded: others.some((e) => e.eventId === res.eventId)
                        ? Number((_c = others.find((e) => e.eventId === res.eventId)) === null || _c === void 0 ? void 0 : _c.responded)
                        : 0, raisedDonation: others.some((e) => e.eventId === res.eventId)
                        ? Number((_d = others.find((e) => e.eventId === res.eventId)) === null || _d === void 0 ? void 0 : _d.raisedDonation)
                        : 0 });
            }),
            total,
        };
    }
    async getByCode(eventCode = "", currentUserCode = "") {
        var _a, _b, _c, _d;
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
                thumbnailFile: true,
                eventImages: {
                    file: true,
                },
            },
        });
        if (!result) {
            throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
        }
        const [interested, responded, raisedDonation, ownerUnReadMessage, ownerUnReadNotif,] = await Promise.all([
            this.eventRepo
                .query(`SELECT COUNT("EventId") FROM dbo."Interested" WHERE "EventId" = ${result.eventId}`)
                .then((res) => {
                var _a;
                return res[0] ? (_a = res[0]["count"]) !== null && _a !== void 0 ? _a : 0 : 0;
            }),
            this.eventRepo
                .query(`SELECT COUNT("EventId") FROM dbo."Responded" WHERE "EventId" = ${result.eventId}`)
                .then((res) => {
                var _a;
                return res[0] ? (_a = res[0]["count"]) !== null && _a !== void 0 ? _a : 0 : 0;
            }),
            this.eventRepo
                .query(`SELECT SUM("Amount") FROM dbo."Transactions" WHERE "Status" = 'COMPLETED' AND "IsCompleted" = true AND "EventId" = ${result.eventId}`)
                .then((res) => {
                var _a;
                return res[0] ? (_a = res[0]["sum"]) !== null && _a !== void 0 ? _a : 0 : 0;
            }),
            this.userConversationRepo.count({
                where: {
                    referenceId: eventCode,
                    fromUser: {
                        userId: (_b = result === null || result === void 0 ? void 0 : result.user) === null || _b === void 0 ? void 0 : _b.userId,
                    },
                    status: (0, typeorm_2.In)(["SENT", "DELIVERED"]),
                },
            }),
            this.notificationsRepo.count({
                where: {
                    referenceId: eventCode,
                    user: {
                        userId: (_c = result === null || result === void 0 ? void 0 : result.user) === null || _c === void 0 ? void 0 : _c.userId,
                    },
                    isRead: false,
                },
            }),
        ]);
        let isCurrentUserInterested = false;
        let isCurrentUserResponded = false;
        let visitorUserConversation;
        let visitorUnReadMessage = 0;
        let visitorUserDonation = 0;
        if (currentUserCode && currentUserCode !== "") {
            const [interestedCount, respondedCount, _visitorUnReadMessage, _visitorUserConversation, _visitorUserDonation,] = await Promise.all([
                this.eventRepo.manager.count(Interested_1.Interested, {
                    where: {
                        user: {
                            userCode: currentUserCode,
                        },
                        event: {
                            eventCode: result.eventCode,
                        },
                    },
                }),
                this.eventRepo.manager.count(Responded_1.Responded, {
                    where: {
                        user: {
                            userCode: currentUserCode,
                        },
                        event: {
                            eventCode: result.eventCode,
                        },
                    },
                }),
                this.eventRepo.manager.count(EventMessage_1.EventMessage, {
                    where: {
                        toUser: {
                            userCode: currentUserCode,
                        },
                        status: (0, typeorm_2.In)(["SENT", "DELIVERED"]),
                        event: {
                            eventCode: result.eventCode,
                        },
                    },
                }),
                this.userConversationRepo.findOne({
                    where: {
                        referenceId: eventCode,
                        fromUser: {
                            userCode: currentUserCode,
                        },
                    },
                    relations: {
                        fromUser: true,
                        toUser: true,
                    },
                }),
                this.eventRepo.manager.find(Transactions_1.Transactions, {
                    where: {
                        event: {
                            eventCode: result === null || result === void 0 ? void 0 : result.eventCode,
                        },
                        user: {
                            userCode: currentUserCode,
                        },
                        isCompleted: true,
                        status: "COMPLETED"
                    },
                }),
            ]);
            isCurrentUserInterested = interestedCount > 0;
            isCurrentUserResponded = respondedCount > 0;
            visitorUnReadMessage = _visitorUnReadMessage;
            visitorUserConversation = _visitorUserConversation;
            visitorUserDonation = _visitorUserDonation.reduce((total, item) => Number(total) +
                (!isNaN(Number(item.amount)) ? Number(item.amount) : 0), 0);
        }
        result.eventImages = result.eventImages.filter((x) => x.active);
        (_d = result.user) === null || _d === void 0 ? true : delete _d.password;
        return Object.assign(Object.assign({}, result), { visitorUnReadMessage: !isNaN(Number(visitorUnReadMessage))
                ? Number(visitorUnReadMessage)
                : 0, interested,
            responded,
            raisedDonation,
            isCurrentUserResponded,
            isCurrentUserInterested,
            visitorUserConversation,
            visitorUserDonation, ownerUnReadNotifications: Number(ownerUnReadMessage) + Number(ownerUnReadNotif), ownerUnReadMessage,
            ownerUnReadNotif });
    }
    async getPageJoinedEvents({ pageSize, pageIndex, order, userCode }) {
        const eventsQuery = await this.eventRepo
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.respondeds", "respond")
            .leftJoinAndSelect("event.thumbnailFile", "thumbnailFile")
            .leftJoinAndSelect("respond.user", "user")
            .select([
            "event.eventId",
            "event.eventCode",
            "event.dateTime",
            "event.eventType",
            "event.eventName",
            "event.eventDesc",
            "event.eventLocName",
            "event.eventLocMap",
            "event.eventAssistanceItems",
            "event.eventStatus",
            "event.active",
            "event.transferType",
            "event.transferAccountNumber",
            "event.transferAccountName",
            "event.donationTargetAmount",
            "event.inProgress",
            "event.dateTimeUpdate",
            "thumbnailFile.fileId",
            "thumbnailFile.fileName",
            "thumbnailFile.url",
            "thumbnailFile.guid",
        ])
            .where("user.userCode = :userCode", { userCode });
        const countQuery = eventsQuery;
        if (order && Object.keys(order).length > 0) {
            Object.keys(order).forEach((key) => {
                eventsQuery.addOrderBy(`event.${key}`, order[key]);
            });
        }
        const [res, total] = await Promise.all([
            eventsQuery
                .take(pageSize)
                .skip(pageIndex * pageSize)
                .getMany(),
            countQuery.getCount(),
        ]);
        return {
            results: res,
            total,
        };
    }
    async getPageInterestedEvents({ pageSize, pageIndex, order, userCode }) {
        const eventsQuery = await this.eventRepo
            .createQueryBuilder("event")
            .leftJoinAndSelect("event.interesteds", "interested")
            .leftJoinAndSelect("event.thumbnailFile", "thumbnailFile")
            .leftJoinAndSelect("interested.user", "user")
            .select([
            "event.eventId",
            "event.eventCode",
            "event.dateTime",
            "event.eventType",
            "event.eventName",
            "event.eventDesc",
            "event.eventLocName",
            "event.eventLocMap",
            "event.eventAssistanceItems",
            "event.eventStatus",
            "event.active",
            "event.transferType",
            "event.transferAccountNumber",
            "event.transferAccountName",
            "event.donationTargetAmount",
            "event.inProgress",
            "event.dateTimeUpdate",
            "thumbnailFile.fileId",
            "thumbnailFile.fileName",
            "thumbnailFile.url",
            "thumbnailFile.guid",
        ])
            .where("user.userCode = :userCode", { userCode });
        const countQuery = eventsQuery;
        if (order && Object.keys(order).length > 0) {
            Object.keys(order).forEach((key) => {
                eventsQuery.addOrderBy(`event.${key}`, order[key]);
            });
        }
        const [res, total] = await Promise.all([
            eventsQuery
                .take(pageSize)
                .skip(pageIndex * pageSize)
                .getMany(),
            countQuery.getCount(),
        ]);
        return {
            results: res,
            total,
        };
    }
    async getEventThumbnailFile(eventCode = "") {
        var _a;
        const result = await this.eventRepo.findOne({
            where: {
                eventCode: (_a = eventCode === null || eventCode === void 0 ? void 0 : eventCode.toString()) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
            },
            relations: {
                thumbnailFile: true,
            },
        });
        return result === null || result === void 0 ? void 0 : result.thumbnailFile;
    }
    async getEventThumbnailContent(path = "") {
        if (path && path !== "") {
            const bucket = this.firebaseProvoder.app.storage().bucket();
            const file = bucket.file(path);
            const [exists] = await file.exists();
            if (exists) {
                return new Promise((resolve, reject) => {
                    const fileStream = file.createReadStream();
                    const chunks = [];
                    fileStream.on("data", (chunk) => {
                        chunks.push(chunk);
                    });
                    fileStream.on("end", () => {
                        resolve(Buffer.concat(chunks));
                    });
                    fileStream.on("error", (err) => {
                        reject(err);
                    });
                });
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            const KM_DISTANCE_NEARBY_DRIVER = 10;
            const getNearbyClients = ` Select "UserId" as "userId"
      from dbo."Users" 
      WHERE "UserType" = 'CLIENT' AND round(
     (earth_distance(
             ll_to_earth(${dto.eventLocMap.latitude}::float, ${dto.eventLocMap.longitude}::float),-- driver point
             ll_to_earth(("CurrentLocation"->>'latitude')::float, ("CurrentLocation"->>'longitude')::float)-- pickup
        )/1000)::decimal, 2) <= ${KM_DISTANCE_NEARBY_DRIVER}`;
            const nearbyClientUserIds = await entityManager
                .query(getNearbyClients)
                .then((res) => {
                return res ? res.map((x) => x.userId) : [];
            });
            console.log("nearbyClientUserIds ", nearbyClientUserIds);
            if (nearbyClientUserIds.length > 0) {
                const forClientTitle = "There's an event nearby that could use your attention!";
                const clientNotifications = await this.logNotification(nearbyClientUserIds, event, entityManager, forClientTitle, event.eventName);
                const multipleClientReq = clientNotifications.map((x) => {
                    var _a;
                    return this.oneSignalNotificationService.sendToExternalUser((_a = x.user) === null || _a === void 0 ? void 0 : _a.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, event.eventCode, [x.notificationId], forClientTitle, event.eventName);
                });
                const pushToClients = await Promise.all(multipleClientReq);
                console.log(pushToClients);
            }
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            await this.saveEventImages(entityManager, event, dto.eventImages);
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
            event.donationTargetAmount = dto.donationTargetAmount;
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            const KM_DISTANCE_NEARBY_DRIVER = 10;
            const getNearbyClients = ` Select "UserId" as "userId"
      from dbo."Users" 
      WHERE "UserType" = 'CLIENT' AND round(
     (earth_distance(
             ll_to_earth(${dto.eventLocMap.latitude}::float, ${dto.eventLocMap.longitude}::float),-- driver point
             ll_to_earth(("CurrentLocation"->>'latitude')::float, ("CurrentLocation"->>'longitude')::float)-- pickup
        )/1000)::decimal, 2) <= ${KM_DISTANCE_NEARBY_DRIVER}`;
            const nearbyClientUserIds = await entityManager
                .query(getNearbyClients)
                .then((res) => {
                return res ? res.map((x) => x.userId) : [];
            });
            console.log("nearbyClientUserIds ", nearbyClientUserIds);
            if (nearbyClientUserIds.length > 0) {
                const forClientTitle = "There's an event nearby that could use your attention!";
                const clientNotifications = await this.logNotification(nearbyClientUserIds, event, entityManager, forClientTitle, event.eventName);
                const multipleClientReq = clientNotifications.map((x) => {
                    var _a;
                    return this.oneSignalNotificationService.sendToExternalUser((_a = x.user) === null || _a === void 0 ? void 0 : _a.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, event.eventCode, [x.notificationId], forClientTitle, event.eventName);
                });
                const pushToClients = await Promise.all(multipleClientReq);
                console.log(pushToClients);
            }
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            await this.saveEventImages(entityManager, event, dto.eventImages);
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
            event.eventAssistanceItems = dto.eventAssistanceItems;
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            const KM_DISTANCE_NEARBY_DRIVER = 10;
            const getClientUserIds = ` 
      WITH 
      nearby AS (
          Select "UserId" as "userId"
          from dbo."Users" WHERE "UserType" = 'CLIENT' 
          AND "Active" = true
          AND round(
          (earth_distance(
                  ll_to_earth(
                  ${dto.eventLocMap.latitude}::float, 
                  ${dto.eventLocMap.longitude}::float),-- driver point
                  ll_to_earth(("CurrentLocation"->>'latitude')::float, ("CurrentLocation"->>'longitude')::float)-- pickup
              )/1000)::decimal, 2) <= ${KM_DISTANCE_NEARBY_DRIVER}
      ),
      specific_user AS (
          SELECT "UserId" as "userId"
          FROM dbo."Users"
          WHERE ARRAY[${dto.eventAssistanceItems
                .map((x) => "'" + x + "'")
                .join(",")}]::character varying[] && "HelpNotifPreferences" AND "Active" = true
        )
        SELECT "userId" from nearby 
        UNION 
        SELECT "userId" from specific_user WHERE "userId" NOT IN (SELECT "userId" from nearby)`;
            const clientUserIds = await entityManager
                .query(getClientUserIds)
                .then((res) => {
                return res ? res.map((x) => x.userId) : [];
            });
            console.log("clientUserIds ", clientUserIds);
            if (clientUserIds.length > 0) {
                const forClientTitle = "There's an event nearby that could use your attention!";
                const clientNotifications = await this.logNotification(clientUserIds, event, entityManager, forClientTitle, event.eventName);
                const multipleClientReq = clientNotifications.map((x) => {
                    var _a;
                    return this.oneSignalNotificationService.sendToExternalUser((_a = x.user) === null || _a === void 0 ? void 0 : _a.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, event.eventCode, [x.notificationId], forClientTitle, event.eventName);
                });
                const pushToClients = await Promise.all(multipleClientReq);
                console.log(pushToClients);
            }
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            await this.saveEventImages(entityManager, event, dto.eventImages);
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
                },
            });
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTimeUpdate = timestamp;
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            await this.saveEventImages(entityManager, event, dto.eventImages);
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
                },
            });
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            event.donationTargetAmount = dto.donationTargetAmount;
            if (!dto.transferType ||
                dto.transferType === "" ||
                ![payment_constant_1.PAYMENT_METHOD.CARD, payment_constant_1.PAYMENT_METHOD.CASH, payment_constant_1.PAYMENT_METHOD.WALLET].some((x) => { var _a; return x === ((_a = dto.transferType) === null || _a === void 0 ? void 0 : _a.toUpperCase()); })) {
                throw new Error("Invalid transfer type!");
            }
            event.transferType = dto.transferType;
            event.transferAccountNumber = dto.transferAccountNumber;
            event.transferAccountName = dto.transferAccountName;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTimeUpdate = timestamp;
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            await this.saveEventImages(entityManager, event, dto.eventImages);
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
                },
            });
            event.eventName = dto.eventName;
            event.eventDesc = dto.eventDesc;
            event.eventLocName = dto.eventLocName;
            event.eventLocMap = dto.eventLocMap;
            event.eventAssistanceItems = dto.eventAssistanceItems;
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTimeUpdate = timestamp;
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            await this.saveEventImages(entityManager, event, dto.eventImages);
            (_a = event.user) === null || _a === void 0 ? true : delete _a.password;
            return event;
        });
    }
    async updateStatus(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c;
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
                },
            });
            if (!event) {
                throw new Error("The event was not found!");
            }
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
            if ((event === null || event === void 0 ? void 0 : event.eventType) === events_constant_1.EVENT_TYPE.ASSISTANCE &&
                dto.status === events_constant_1.EVENT_STATUS.APPROVED) {
                event.inProgress = true;
                event.eventStatus = dto.status;
            }
            else if ((event === null || event === void 0 ? void 0 : event.eventType) === events_constant_1.EVENT_TYPE.ASSISTANCE &&
                dto.status === events_constant_1.EVENT_STATUS.COMPLETED) {
                event.inProgress = false;
                event.eventStatus = dto.status;
            }
            if (dto.status === events_constant_1.EVENT_STATUS.INPROGRESS &&
                (event === null || event === void 0 ? void 0 : event.eventType) !== events_constant_1.EVENT_TYPE.ASSISTANCE) {
                event.inProgress = true;
                event.eventStatus = events_constant_1.EVENT_STATUS.APPROVED;
            }
            else if ((event === null || event === void 0 ? void 0 : event.eventType) !== events_constant_1.EVENT_TYPE.ASSISTANCE) {
                event.eventStatus = dto.status;
                event.inProgress = false;
            }
            const timestamp = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTimeUpdate = timestamp;
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
                    thumbnailFile: true,
                    eventImages: {
                        file: true,
                    },
                },
            });
            if (event.eventLocMap &&
                event.eventLocMap["latitude"] &&
                event.eventLocMap["longitude"] &&
                ((_a = event.user) === null || _a === void 0 ? void 0 : _a.userId) &&
                (dto.status === events_constant_1.EVENT_STATUS.APPROVED ||
                    dto.status === events_constant_1.EVENT_STATUS.REJECTED)) {
                const forClientTitle = dto.status === events_constant_1.EVENT_STATUS.APPROVED
                    ? "Your event was approved!"
                    : "Your event was rejected";
                const clientNotifications = await this.logNotification([(_b = event.user) === null || _b === void 0 ? void 0 : _b.userId], event, entityManager, forClientTitle, event.eventName);
                const multipleClientReq = clientNotifications.map((x) => {
                    var _a;
                    return this.oneSignalNotificationService.sendToExternalUser((_a = x.user) === null || _a === void 0 ? void 0 : _a.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, event.eventCode, [x.notificationId], forClientTitle, event.eventName);
                });
                const pushToClients = await Promise.all(multipleClientReq);
                console.log(pushToClients);
            }
            if (!event) {
                throw Error(events_constant_1.EVENT_ERROR_NOT_FOUND);
            }
            (_c = event.user) === null || _c === void 0 ? true : delete _c.password;
            return event;
        });
    }
    async updateEventInterested(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e;
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
                        thumbnailFile: true,
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
            if (user.userCode !== ((_a = event.user) === null || _a === void 0 ? void 0 : _a.userCode) &&
                user.userType === user_type_constant_1.USER_TYPE.CLIENT) {
                if (!interested) {
                    interested = new Interested_1.Interested();
                    interested.event = event;
                    interested.user = user;
                    interested = await entityManager.save(Interested_1.Interested, interested);
                    interestedCount =
                        interestedCount && !isNaN(Number(interestedCount))
                            ? Number(interestedCount) + 1
                            : 1;
                    const totalOthers = Number(interestedCount) > 0 ? interestedCount - 1 : 0;
                    const pushNotifTitle = interestedCount > 1 ? `${user === null || user === void 0 ? void 0 : user.name} and ${totalOthers > 1 ? totalOthers + ' others are interested in your event.' : totalOthers + ' other are interested in your event.'}` : `${user === null || user === void 0 ? void 0 : user.name} is interested in your event.`;
                    const pushNotifDesc = event === null || event === void 0 ? void 0 : event.eventName;
                    const clientNotifications = await this.logNotification([(_b = event.user) === null || _b === void 0 ? void 0 : _b.userId], event, entityManager, pushNotifTitle, pushNotifDesc);
                    const pushNotif = await this.oneSignalNotificationService.sendToExternalUser((_c = event.user) === null || _c === void 0 ? void 0 : _c.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, event === null || event === void 0 ? void 0 : event.eventCode, clientNotifications, pushNotifTitle, pushNotifDesc);
                    console.log(pushNotif);
                }
                else {
                    interested = await entityManager.findOne(Interested_1.Interested, {
                        where: {
                            user: {
                                userCode: dto.userCode,
                            },
                            event: {
                                thumbnailFile: true,
                                eventCode: eventCode,
                            },
                        },
                        relations: {},
                    });
                    await entityManager.delete(Interested_1.Interested, interested);
                    interestedCount =
                        interestedCount && !isNaN(Number(interestedCount))
                            ? Number(interestedCount) - 1
                            : 0;
                }
            }
            const dateTime = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTimeUpdate = dateTime;
            event = await entityManager.save(Events_1.Events, event);
            event = await entityManager.findOne(Events_1.Events, {
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
                    thumbnailFile: true,
                },
            });
            (_d = event.user) === null || _d === void 0 ? true : delete _d.password;
            (_e = event.user) === null || _e === void 0 ? true : delete _e.password;
            return Object.assign(Object.assign({}, event), { interested: interestedCount });
        });
    }
    async updateEventResponded(eventCode, dto) {
        return await this.eventRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e;
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
            if (user.userCode !== ((_a = event.user) === null || _a === void 0 ? void 0 : _a.userCode) &&
                user.userType === user_type_constant_1.USER_TYPE.CLIENT) {
                if (!responded) {
                    responded = new Responded_1.Responded();
                    responded.event = event;
                    responded.user = user;
                    responded = await entityManager.save(Responded_1.Responded, responded);
                    respondedCount =
                        respondedCount && !isNaN(Number(respondedCount))
                            ? Number(respondedCount) + 1
                            : 1;
                    const totalOthers = Number(respondedCount) > 0 ? respondedCount - 1 : 0;
                    const pushNotifTitle = respondedCount > 1 ? `${user === null || user === void 0 ? void 0 : user.name} and ${totalOthers > 1 ? totalOthers + ' others responded for your event.' : totalOthers + ' other responded for your event.'}` : `${user === null || user === void 0 ? void 0 : user.name} responded for your event.`;
                    const pushNotifDesc = event === null || event === void 0 ? void 0 : event.eventName;
                    const clientNotifications = await this.logNotification([(_b = event.user) === null || _b === void 0 ? void 0 : _b.userId], event, entityManager, pushNotifTitle, pushNotifDesc);
                    const pushNotif = await this.oneSignalNotificationService.sendToExternalUser((_c = event.user) === null || _c === void 0 ? void 0 : _c.userName, notifications_constant_1.NOTIF_TYPE.EVENTS, event === null || event === void 0 ? void 0 : event.eventCode, clientNotifications, pushNotifTitle, pushNotifDesc);
                    console.log(pushNotif);
                }
                else {
                    responded = await entityManager.findOne(Responded_1.Responded, {
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
                    await entityManager.delete(Responded_1.Responded, responded);
                    respondedCount =
                        respondedCount && !isNaN(Number(respondedCount))
                            ? Number(respondedCount) - 1
                            : 0;
                }
            }
            const dateTime = await entityManager
                .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                .then((res) => {
                return res[0]["timestamp"];
            });
            event.dateTimeUpdate = dateTime;
            event = await entityManager.save(Events_1.Events, event);
            event = await entityManager.findOne(Events_1.Events, {
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
                    thumbnailFile: true,
                },
            });
            (_d = event.user) === null || _d === void 0 ? true : delete _d.password;
            (_e = event.user) === null || _e === void 0 ? true : delete _e.password;
            return Object.assign(Object.assign({}, event), { responded: respondedCount });
        });
    }
    async saveEventImages(entityManager, event, eventImages = []) {
        const bucket = this.firebaseProvoder.app.storage().bucket();
        let currentBucketFilePath = null;
        const files = [];
        try {
            if (eventImages && eventImages.length > 0) {
                for (const image of eventImages) {
                    const newGUID = (0, uuid_1.v4)();
                    if (image && image.new && !image.delete) {
                        currentBucketFilePath = `events/${event.eventCode}/${newGUID}${(0, path_1.extname)(image.fileName)}`;
                        const bucketFile = bucket.file(currentBucketFilePath);
                        const img = Buffer.from(image.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            let file = new Files_1.Files();
                            file.url = url[0];
                            file.fileName = image.fileName;
                            file.guid = newGUID;
                            file = await entityManager.save(Files_1.Files, file);
                            let eventImage = new EventImage_1.EventImage();
                            eventImage.event = event;
                            eventImage.file = file;
                            eventImage.user = event.user;
                            eventImage = await entityManager.save(EventImage_1.EventImage, eventImage);
                            files.push(file);
                        });
                    }
                    else if (!image.delete) {
                        const eventImage = await entityManager.findOne(EventImage_1.EventImage, {
                            where: { fileId: image.fileId },
                            relations: {
                                file: true,
                            },
                        });
                        if (eventImage) {
                            currentBucketFilePath = null;
                            try {
                                const deleteFile = bucket.file(`events/${event.eventCode}/${eventImage.file.guid}${(0, path_1.extname)(eventImage.file.fileName)}`);
                                const exists = await deleteFile.exists();
                                if (exists[0]) {
                                    deleteFile.delete();
                                }
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                        }
                        else {
                            eventImage.file = new Files_1.Files();
                            eventImage.file.guid = newGUID;
                        }
                        let file = eventImage.file;
                        currentBucketFilePath = `events/${event.eventCode}/${eventImage.file.guid}${(0, path_1.extname)(image.fileName)}`;
                        const bucketFile = bucket.file(currentBucketFilePath);
                        const img = Buffer.from(image.data, "base64");
                        await bucketFile.save(img).then(async (res) => {
                            console.log("res");
                            console.log(res);
                            const url = await bucketFile.getSignedUrl({
                                action: "read",
                                expires: "03-09-2500",
                            });
                            file.url = url[0];
                            file.fileName = image.fileName;
                            files.push(file);
                            file = await entityManager.save(Files_1.Files, file);
                        });
                    }
                    else {
                        const eventImage = await entityManager.findOne(EventImage_1.EventImage, {
                            where: { fileId: image.fileId },
                            relations: {
                                file: true,
                            },
                        });
                        if (eventImage) {
                            try {
                                const deleteFile = bucket.file(`events/${event.eventCode}/${eventImage.file.guid}${(0, path_1.extname)(eventImage.file.fileName)}`);
                                const exists = await deleteFile.exists();
                                if (exists[0]) {
                                    deleteFile.delete();
                                }
                            }
                            catch (ex) {
                                console.log(ex);
                            }
                            eventImage.active = false;
                            await entityManager.save(EventImage_1.EventImage, eventImage);
                        }
                    }
                }
                const currentImages = await entityManager.find(EventImage_1.EventImage, {
                    where: {
                        eventId: event.eventId,
                        active: true,
                    },
                    relations: {
                        file: true,
                    },
                });
                if (files.filter((x) => !x.delete).length > 0 &&
                    currentImages.length > 0) {
                    event = await entityManager.findOne(Events_1.Events, {
                        where: {
                            eventId: event.eventId,
                        },
                    });
                    event.thumbnailFile = files[0];
                    await entityManager.save(Events_1.Events, event);
                }
                else if (files.filter((x) => x.delete).length > 0 &&
                    currentImages.length > 0) {
                    event = await entityManager.findOne(Events_1.Events, {
                        where: {
                            eventId: event.eventId,
                        },
                    });
                    event.thumbnailFile = currentImages[0].file;
                    await entityManager.save(Events_1.Events, event);
                }
                else if (currentImages.length === 0) {
                    event = await entityManager.findOne(Events_1.Events, {
                        where: {
                            eventId: event.eventId,
                        },
                    });
                    event.thumbnailFile = null;
                    await entityManager.save(Events_1.Events, event);
                }
            }
        }
        catch (ex) {
            try {
                if (currentBucketFilePath && currentBucketFilePath !== "") {
                    const deleteFile = bucket.file(currentBucketFilePath);
                    const exists = await deleteFile.exists();
                    if (exists[0]) {
                        deleteFile.delete();
                    }
                }
            }
            catch (ex) {
                console.log(ex);
            }
            throw ex;
        }
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
                type: notifications_constant_1.NOTIF_TYPE.EVENTS.toString(),
                referenceId: data.eventCode.toString(),
                isRead: false,
                user: user,
            });
        }
        const res = await entityManager.save(Notifications_1.Notifications, notifications);
        return await entityManager.find(Notifications_1.Notifications, {
            where: {
                notificationId: (0, typeorm_2.In)(res.map(x => x.notificationId)),
                referenceId: data.eventCode,
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
EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Events_1.Events)),
    __param(1, (0, typeorm_1.InjectRepository)(UserConversation_1.UserConversation)),
    __param(2, (0, typeorm_1.InjectRepository)(Notifications_1.Notifications)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        firebase_provider_1.FirebaseProvider,
        one_signal_notification_service_1.OneSignalNotificationService])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map