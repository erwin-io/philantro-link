import { map } from "rxjs";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { PusherService } from "nestjs-pusher";
import {
  NOTIF_TITLE,
  NOTIF_TYPE,
} from "src/common/constant/notifications.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { Events } from "src/db/entities/Events";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
import { Repository, EntityManager, In } from "typeorm";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import {
  EVENT_ERROR_NOT_FOUND,
  EVENT_STATUS,
  EVENT_TYPE,
} from "src/common/constant/events.constant";
import {
  CreateAssistanceEventDto,
  CreateCharityVolunteerEventDto,
  CreateDonationEventDto,
} from "src/core/dto/events/events.create.dto";
import { DateConstant } from "src/common/constant/date.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import {
  UpdateCharityVolunteerEventDto,
  UpdateDonationEventDto,
  UpdateAssistanceEventDto,
  UpdateEventStatusDto,
  UpdateEventInterestedDto,
  UpdateEventRespondedDto,
} from "src/core/dto/events/events.update.dto";
import { Interested } from "src/db/entities/Interested";
import { Responded } from "src/db/entities/Responded";
import { PAYMENT_METHOD } from "src/common/constant/payment.constant";
import { Access } from "src/db/entities/Access";
import { v4 as uuid } from "uuid";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Files } from "src/db/entities/Files";
import { EventImage } from "src/db/entities/EventImage";
import { extname } from "path";
import { EventMessage } from "src/db/entities/EventMessage";
import { UserConversation } from "src/db/entities/UserConversation";
import { Transactions } from "src/db/entities/Transactions";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepo: Repository<Events>,
    @InjectRepository(UserConversation)
    private readonly userConversationRepo: Repository<UserConversation>,
    @InjectRepository(Notifications)
    private readonly notificationsRepo: Repository<Notifications>,
    private firebaseProvoder: FirebaseProvider,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total, others] = await Promise.all([
      this.eventRepo.find({
        where: {
          ...condition,
        },
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
        where: {
          ...condition,
        },
      }),
      this.eventRepo
        .find({
          where: {
            ...condition,
          },
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
          WITH records AS (select "EventId" as "eventId" from dbo."Events" WHERE "EventId" IN(${
            res.length > 0 ? res.map((x) => x.eventId).join(",") : 0
          })
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
        delete res.user?.password;
        return {
          ...res,
          eventImages: res.eventImages.filter((x) => x.active),
          interested: others.some((e) => e.eventId === res.eventId)
            ? Number(others.find((e) => e.eventId === res.eventId)?.interested)
            : 0,
          responded: others.some((e) => e.eventId === res.eventId)
            ? Number(others.find((e) => e.eventId === res.eventId)?.responded)
            : 0,
          raisedDonation: others.some((e) => e.eventId === res.eventId)
            ? Number(
                others.find((e) => e.eventId === res.eventId)?.raisedDonation
              )
            : 0,
        };
      }),
      total,
    };
  }

  async getByCode(eventCode = "", currentUserCode = "") {
    const result = await this.eventRepo.findOne({
      where: {
        eventCode: eventCode?.toString()?.toLowerCase(),
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
      throw Error(EVENT_ERROR_NOT_FOUND);
    }

    const [
      interested,
      responded,
      raisedDonation,
      ownerUnReadMessage,
      ownerUnReadNotif,
    ] = await Promise.all([
      this.eventRepo
        .query(
          `SELECT COUNT("EventId") FROM dbo."Interested" WHERE "EventId" = ${result.eventId}`
        )
        .then((res) => {
          return res[0] ? res[0]["count"] ?? 0 : 0;
        }),
      this.eventRepo
        .query(
          `SELECT COUNT("EventId") FROM dbo."Responded" WHERE "EventId" = ${result.eventId}`
        )
        .then((res) => {
          return res[0] ? res[0]["count"] ?? 0 : 0;
        }),
      this.eventRepo
        .query(
          `SELECT SUM("Amount") FROM dbo."Transactions" WHERE "Status" = 'COMPLETED' AND "IsCompleted" = true AND "EventId" = ${result.eventId}`
        )
        .then((res) => {
          return res[0] ? res[0]["sum"] ?? 0 : 0;
        }),
      this.userConversationRepo.count({
        where: {
          referenceId: eventCode,
          fromUser: {
            userId: result?.user?.userId,
          },
          status: In(["SENT", "DELIVERED"]),
        },
      }),
      this.notificationsRepo.count({
        where: {
          referenceId: eventCode,
          user: {
            userId: result?.user?.userId,
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
      const [
        interestedCount,
        respondedCount,
        _visitorUnReadMessage,
        _visitorUserConversation,
        _visitorUserDonation,
      ] = await Promise.all([
        this.eventRepo.manager.count(Interested, {
          where: {
            user: {
              userCode: currentUserCode,
            },
            event: {
              eventCode: result.eventCode,
            },
          },
        }),
        this.eventRepo.manager.count(Responded, {
          where: {
            user: {
              userCode: currentUserCode,
            },
            event: {
              eventCode: result.eventCode,
            },
          },
        }),
        this.eventRepo.manager.count(EventMessage, {
          where: {
            toUser: {
              userCode: currentUserCode,
            },
            status: In(["SENT", "DELIVERED"]),
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
        this.eventRepo.manager.find(Transactions, {
          where: {
            event: {
              eventCode: result?.eventCode,
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
      visitorUserDonation = _visitorUserDonation.reduce(
        (total, item) =>
          Number(total) +
          (!isNaN(Number(item.amount)) ? Number(item.amount) : 0),
        0
      );
    }
    result.eventImages = result.eventImages.filter((x) => x.active);
    delete result.user?.password;
    return {
      ...result,
      visitorUnReadMessage: !isNaN(Number(visitorUnReadMessage))
        ? Number(visitorUnReadMessage)
        : 0,
      interested,
      responded,
      raisedDonation,
      isCurrentUserResponded,
      isCurrentUserInterested,
      visitorUserConversation,
      visitorUserDonation,
      ownerUnReadNotifications:
        Number(ownerUnReadMessage) + Number(ownerUnReadNotif),
      ownerUnReadMessage,
      ownerUnReadNotif,
    };
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
    const result = await this.eventRepo.findOne({
      where: {
        eventCode: eventCode?.toString()?.toLowerCase(),
      },
      relations: {
        thumbnailFile: true,
      },
    });
    return result?.thumbnailFile;
  }

  async getEventThumbnailContent(path = "") {
    if (path && path !== "") {
      const bucket = this.firebaseProvoder.app.storage().bucket();
      const file = bucket.file(path);

      const [exists] = await file.exists();
      if (exists) {
        return new Promise<Buffer>((resolve, reject) => {
          const fileStream = file.createReadStream();
          const chunks: Buffer[] = [];

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
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async createCharityVolunteerEvent(dto: CreateCharityVolunteerEventDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = new Events();
      event.eventType = dto.eventType;
      event.eventName = dto.eventName;
      event.eventDesc = dto.eventDesc;
      event.eventLocName = dto.eventLocName;
      event.eventLocMap = dto.eventLocMap;
      const dateTime = moment(
        new Date(dto.dateTime),
        DateConstant.DATE_LANGUAGE
      ).toISOString();
      event.dateTime = new Date(dateTime);
      const user = await entityManager.findOne(Users, {
        where: {
          userCode: dto.userCode,
          userType: USER_TYPE.CLIENT,
          active: true,
        },
      });
      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      event.user = user;
      event.eventStatus = EVENT_STATUS.PENDING;
      event = await entityManager.save(event);
      event.eventCode = generateIndentityCode(event.eventId);
      event = await entityManager.save(event);
      event = await entityManager.findOne(Events, {
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
        const forClientTitle =
          "There's an event nearby that could use your attention!";

        const clientNotifications: Notifications[] = await this.logNotification(
          nearbyClientUserIds,
          event,
          entityManager,
          forClientTitle,
          event.eventName
        );

        const multipleClientReq = clientNotifications.map((x) => {
          return this.oneSignalNotificationService.sendToExternalUser(
            x.user?.userName,
            NOTIF_TYPE.EVENTS,
            event.eventCode,
            [x.notificationId],
            forClientTitle,
            event.eventName
          );
        });

        const pushToClients: {
          userId: string;
          success: boolean;
        }[] = await Promise.all(multipleClientReq);
        console.log(pushToClients);
      }
      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      await this.saveEventImages(entityManager, event, dto.eventImages);
      delete event.user?.password;
      return event;
    });
  }

  async createDonationEvent(dto: CreateDonationEventDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = new Events();
      event.eventType = EVENT_TYPE.DONATION;
      event.eventName = dto.eventName;
      event.eventDesc = dto.eventDesc;
      event.eventLocName = dto.eventLocName;
      event.eventLocMap = dto.eventLocMap;
      event.donationTargetAmount = dto.donationTargetAmount;
      event.transferType = dto.transferType;
      event.transferAccountNumber = dto.transferAccountNumber;
      event.transferAccountName = dto.transferAccountName;
      const dateTime = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTime = dateTime;
      const user = await entityManager.findOne(Users, {
        where: {
          userCode: dto.userCode,
          userType: USER_TYPE.CLIENT,
          active: true,
        },
      });
      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      event.user = user;
      event.eventStatus = EVENT_STATUS.PENDING;
      event = await entityManager.save(event);
      event.eventCode = generateIndentityCode(event.eventId);
      event = await entityManager.save(event);
      event = await entityManager.findOne(Events, {
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
        const forClientTitle =
          "There's an event nearby that could use your attention!";

        const clientNotifications: Notifications[] = await this.logNotification(
          nearbyClientUserIds,
          event,
          entityManager,
          forClientTitle,
          event.eventName
        );

        const multipleClientReq = clientNotifications.map((x) => {
          return this.oneSignalNotificationService.sendToExternalUser(
            x.user?.userName,
            NOTIF_TYPE.EVENTS,
            event.eventCode,
            [x.notificationId],
            forClientTitle,
            event.eventName
          );
        });

        const pushToClients: {
          userId: string;
          success: boolean;
        }[] = await Promise.all(multipleClientReq);
        console.log(pushToClients);
      }
      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      await this.saveEventImages(entityManager, event, dto.eventImages);
      delete event.user?.password;
      return event;
    });
  }

  async createAssistanceEvent(dto: CreateAssistanceEventDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = new Events();
      event.eventType = EVENT_TYPE.ASSISTANCE;
      event.eventName = dto.eventName;
      event.eventDesc = dto.eventDesc;
      event.eventLocName = dto.eventLocName;
      event.eventLocMap = dto.eventLocMap;
      event.eventAssistanceItems = dto.eventAssistanceItems;
      const dateTime = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTime = dateTime;
      const user = await entityManager.findOne(Users, {
        where: {
          userCode: dto.userCode,
          userType: USER_TYPE.CLIENT,
          active: true,
        },
      });
      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      event.user = user;
      event.eventStatus = EVENT_STATUS.PENDING;
      event = await entityManager.save(event);
      event.eventCode = generateIndentityCode(event.eventId);
      event = await entityManager.save(event);
      event = await entityManager.findOne(Events, {
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
          AND "UserId" <> ${user?.userId}
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
            .join(
              ","
            )}]::character varying[] && "HelpNotifPreferences" AND "Active" = true AND "UserId" <> ${user?.userId}
        )
        SELECT "userId" from nearby WHERE "userId" <> ${user?.userId}
        UNION 
        SELECT "userId" from specific_user WHERE "userId" <> ${user?.userId} AND  "userId" NOT IN (SELECT "userId" from nearby)`;

      const clientUserIds = await entityManager
        .query(getClientUserIds)
        .then((res) => {
          return res ? res.map((x) => x.userId) : [];
        });

      console.log("clientUserIds ", clientUserIds);

      if (clientUserIds.length > 0) {
        const forClientTitle =
          "There's an event nearby that could use your attention!";

        const clientNotifications: Notifications[] = await this.logNotification(
          clientUserIds,
          event,
          entityManager,
          forClientTitle,
          event.eventName
        );

        const multipleClientReq = clientNotifications.map((x) => {
          return this.oneSignalNotificationService.sendToExternalUser(
            x.user?.userName,
            NOTIF_TYPE.EVENTS,
            event.eventCode,
            [x.notificationId],
            forClientTitle,
            event.eventName
          );
        });

        const pushToClients: {
          userId: string;
          success: boolean;
        }[] = await Promise.all(multipleClientReq);
        console.log(pushToClients);
      }

      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      await this.saveEventImages(entityManager, event, dto.eventImages);
      delete event.user?.password;
      return event;
    });
  }

  async updateCharityVolunteerEvent(
    eventCode,
    dto: UpdateCharityVolunteerEventDto
  ) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = await entityManager.findOne(Events, {
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
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTimeUpdate = timestamp;
      event.dateTime = new Date(dto.dateTime);
      event = await entityManager.save(Events, event);
      event = await entityManager.findOne(Events, {
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
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      await this.saveEventImages(entityManager, event, dto.eventImages);
      delete event.user?.password;
      return event;
    });
  }

  async updateDonationEvent(eventCode, dto: UpdateDonationEventDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = await entityManager.findOne(Events, {
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
      if (
        !dto.transferType ||
        dto.transferType === "" ||
        ![PAYMENT_METHOD.CARD, PAYMENT_METHOD.CASH, PAYMENT_METHOD.WALLET].some(
          (x) => x === dto.transferType?.toUpperCase()
        )
      ) {
        throw new Error("Invalid transfer type!");
      }
      event.transferType = dto.transferType;
      event.transferAccountNumber = dto.transferAccountNumber;
      event.transferAccountName = dto.transferAccountName;
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTimeUpdate = timestamp;
      event = await entityManager.save(Events, event);
      event = await entityManager.findOne(Events, {
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
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      await this.saveEventImages(entityManager, event, dto.eventImages);
      delete event.user?.password;
      return event;
    });
  }

  async updateAssistanceEvent(eventCode, dto: UpdateAssistanceEventDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = await entityManager.findOne(Events, {
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
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTimeUpdate = timestamp;
      event = await entityManager.save(Events, event);
      event = await entityManager.findOne(Events, {
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
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      await this.saveEventImages(entityManager, event, dto.eventImages);
      delete event.user?.password;
      return event;
    });
  }

  async updateStatus(eventCode, dto: UpdateEventStatusDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = await entityManager.findOne(Events, {
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
      if (
        (event.eventStatus !== EVENT_STATUS.PENDING &&
          event.eventStatus !== EVENT_STATUS.APPROVED &&
          !event.inProgress) ||
        dto.status === event.eventStatus
      ) {
        throw new Error(
          "The event was already: " + event.eventStatus.toLocaleLowerCase()
        );
      }
      if (
        (dto.status === EVENT_STATUS.INPROGRESS &&
          event.eventStatus === EVENT_STATUS.PENDING ) ||
        (dto.status === EVENT_STATUS.COMPLETED &&
          event.eventStatus === EVENT_STATUS.PENDING)
      ) {
        throw new Error("The event was not yet approved!");
      }
      if (dto.status === EVENT_STATUS.COMPLETED && !event.inProgress) {
        throw new Error("The event was not yet started!");
      }

      if (
        event?.eventType === EVENT_TYPE.ASSISTANCE &&
        dto.status === EVENT_STATUS.APPROVED
      ) {
        event.inProgress = true;
        event.eventStatus = dto.status;
      } else if (
        event?.eventType === EVENT_TYPE.ASSISTANCE &&
        dto.status === EVENT_STATUS.COMPLETED
      ) {
        event.inProgress = false;
        event.eventStatus = dto.status;
      }
      if (
        dto.status === EVENT_STATUS.INPROGRESS &&
        event?.eventType !== EVENT_TYPE.ASSISTANCE && event?.eventType !== EVENT_TYPE.DONATION
      ) {
        event.inProgress = true;
        event.eventStatus = EVENT_STATUS.APPROVED;
      } else if (event?.eventType !== EVENT_TYPE.ASSISTANCE) {
        event.eventStatus = dto.status;
        event.inProgress = false;
      }

      
      if (
        dto.status === EVENT_STATUS.APPROVED &&
        event?.eventType === EVENT_TYPE.DONATION
      ) {
        event.inProgress = true;
        event.eventStatus = EVENT_STATUS.APPROVED;
      } else {
        event.eventStatus = dto.status;
      }
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTimeUpdate = timestamp;
      event = await entityManager.save(Events, event);
      event = await entityManager.findOne(Events, {
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

      if (
        event.eventLocMap &&
        event.eventLocMap["latitude"] &&
        event.eventLocMap["longitude"] &&
        event.user?.userId &&
        (dto.status === EVENT_STATUS.APPROVED ||
          dto.status === EVENT_STATUS.REJECTED)
      ) {
        const forClientTitle = dto.status === EVENT_STATUS.APPROVED
          ? "Your event was approved!"
          : "Your event was rejected";

        const clientNotifications: Notifications[] = await this.logNotification(
          [event.user?.userId],
          event,
          entityManager,
          forClientTitle,
          event.eventName
        );

        const multipleClientReq = clientNotifications.map((x) => {
          return this.oneSignalNotificationService.sendToExternalUser(
            x.user?.userName,
            NOTIF_TYPE.EVENTS,
            event.eventCode,
            [x.notificationId],
            forClientTitle,
            event.eventName
          );
        });

        const pushToClients: {
          userId: string;
          success: boolean;
        }[] = await Promise.all(multipleClientReq);
        console.log(pushToClients);
      }
      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      delete event.user?.password;
      return event;
    });
  }

  async updateEventInterested(eventCode, dto: UpdateEventInterestedDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = await entityManager.findOne(Events, {
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
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      const user = await entityManager.findOne(Users, {
        where: {
          userCode: dto.userCode,
        },
        relations: {},
      });
      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      let interested = await entityManager.findOne(Interested, {
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
      let interestedCount: number = await this.eventRepo
        .query(
          `SELECT COUNT("EventId") FROM dbo."Interested" WHERE "EventId" = ${event.eventId}`
        )
        .then((res) => {
          return res[0] ? res[0]["count"] ?? 0 : 0;
        });

      if (
        user.userCode !== event.user?.userCode &&
        user.userType === USER_TYPE.CLIENT
      ) {
        if (!interested) {
          interested = new Interested();
          interested.event = event;
          interested.user = user;
          interested = await entityManager.save(Interested, interested);
          interestedCount =
            interestedCount && !isNaN(Number(interestedCount))
              ? Number(interestedCount) + 1
              : 1;

          const totalOthers = Number(interestedCount) > 0 ? interestedCount - 1 : 0;
          const pushNotifTitle = interestedCount > 1 ? `${user?.name} and ${totalOthers > 1 ? totalOthers + ' others are interested in your event.' : totalOthers + ' other are interested in your event.'}` : `${user?.name} is interested in your event.`;
          const pushNotifDesc = event?.eventName;
          const clientNotifications: Notifications[] = await this.logNotification(
            [event.user?.userId],
            event,
            entityManager,
            pushNotifTitle,
            pushNotifDesc
          );
  
          const pushNotif =
            await this.oneSignalNotificationService.sendToExternalUser(
              event.user?.userName,
              NOTIF_TYPE.EVENTS,
              event?.eventCode,
              clientNotifications,
              pushNotifTitle,
              pushNotifDesc
            );
          console.log(pushNotif);
        } else {
          interested = await entityManager.findOne(Interested, {
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
          await entityManager.delete(Interested, interested);
          interestedCount =
            interestedCount && !isNaN(Number(interestedCount))
              ? Number(interestedCount) - 1
              : 0;
        }
      }
      const dateTime = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTimeUpdate = dateTime;
      event = await entityManager.save(Events, event);
      event = await entityManager.findOne(Events, {
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
      delete event.user?.password;
      delete event.user?.password;
      return {
        ...event,
        interested: interestedCount,
      };
    });
  }

  async updateEventResponded(eventCode, dto: UpdateEventRespondedDto) {
    return await this.eventRepo.manager.transaction(async (entityManager) => {
      let event = await entityManager.findOne(Events, {
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
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
      const user = await entityManager.findOne(Users, {
        where: {
          userCode: dto.userCode,
        },
        relations: {},
      });
      if (!user) {
        throw Error(USER_ERROR_USER_NOT_FOUND);
      }
      let responded = await entityManager.findOne(Responded, {
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
      let respondedCount: number = await this.eventRepo
        .query(
          `SELECT COUNT("EventId") FROM dbo."Responded" WHERE "EventId" = ${event.eventId}`
        )
        .then((res) => {
          return res[0] ? res[0]["count"] ?? 0 : 0;
        });
      if (
        user.userCode !== event.user?.userCode &&
        user.userType === USER_TYPE.CLIENT
      ) {
        if (!responded) {
          responded = new Responded();
          responded.event = event;
          responded.user = user;
          responded = await entityManager.save(Responded, responded);
          respondedCount =
            respondedCount && !isNaN(Number(respondedCount))
              ? Number(respondedCount) + 1
              : 1;

          const totalOthers = Number(respondedCount) > 0 ? respondedCount - 1 : 0;
          const pushNotifTitle = respondedCount > 1 ? `${user?.name} and ${totalOthers > 1 ? totalOthers + ' others responded for your event.' : totalOthers + ' other responded for your event.'}` : `${user?.name} responded for your event.`;
          const pushNotifDesc = event?.eventName;
          const clientNotifications: Notifications[] = await this.logNotification(
            [event.user?.userId],
            event,
            entityManager,
            pushNotifTitle,
            pushNotifDesc
          );
  
          const pushNotif =
            await this.oneSignalNotificationService.sendToExternalUser(
              event.user?.userName,
              NOTIF_TYPE.EVENTS,
              event?.eventCode,
              clientNotifications,
              pushNotifTitle,
              pushNotifDesc
            );
          console.log(pushNotif);
        } else {
          responded = await entityManager.findOne(Responded, {
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
          await entityManager.delete(Responded, responded);
          respondedCount =
            respondedCount && !isNaN(Number(respondedCount))
              ? Number(respondedCount) - 1
              : 0;
        }
      }
      const dateTime = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      event.dateTimeUpdate = dateTime;
      event = await entityManager.save(Events, event);
      event = await entityManager.findOne(Events, {
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
      delete event.user?.password;
      delete event.user?.password;
      return {
        ...event,
        responded: respondedCount,
      };
    });
  }

  async saveEventImages(
    entityManager: EntityManager,
    event: Events,
    eventImages: any[] = []
  ) {
    const bucket = this.firebaseProvoder.app.storage().bucket();
    let currentBucketFilePath = null;
    const files = [];
    try {
      if (eventImages && eventImages.length > 0) {
        for (const image of eventImages) {
          const newGUID: string = uuid();
          if (image && image.new && !image.delete) {
            currentBucketFilePath = `events/${
              event.eventCode
            }/${newGUID}${extname(image.fileName)}`;
            const bucketFile = bucket.file(currentBucketFilePath);
            const img = Buffer.from(image.data, "base64");
            await bucketFile.save(img).then(async (res) => {
              console.log("res");
              console.log(res);
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              let file = new Files();
              file.url = url[0];
              file.fileName = image.fileName;
              file.guid = newGUID;
              file = await entityManager.save(Files, file);
              let eventImage = new EventImage();
              eventImage.event = event;
              eventImage.file = file;
              eventImage.user = event.user;
              eventImage = await entityManager.save(EventImage, eventImage);
              files.push(file);
            });
          } else if (!image.delete) {
            const eventImage = await entityManager.findOne(EventImage, {
              where: { fileId: image.fileId },
              relations: {
                file: true,
              },
            });
            if (eventImage) {
              currentBucketFilePath = null;
              try {
                const deleteFile = bucket.file(
                  `events/${event.eventCode}/${eventImage.file.guid}${extname(
                    eventImage.file.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
            } else {
              eventImage.file = new Files();
              eventImage.file.guid = newGUID;
            }
            let file = eventImage.file;
            currentBucketFilePath = `events/${event.eventCode}/${
              eventImage.file.guid
            }${extname(image.fileName)}`;
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
              file = await entityManager.save(Files, file);
            });
          } else {
            const eventImage = await entityManager.findOne(EventImage, {
              where: { fileId: image.fileId },
              relations: {
                file: true,
              },
            });
            if (eventImage) {
              try {
                const deleteFile = bucket.file(
                  `events/${event.eventCode}/${eventImage.file.guid}${extname(
                    eventImage.file.fileName
                  )}`
                );
                const exists = await deleteFile.exists();
                if (exists[0]) {
                  deleteFile.delete();
                }
              } catch (ex) {
                console.log(ex);
              }
              eventImage.active = false;
              await entityManager.save(EventImage, eventImage);
            }
          }
        }
        const currentImages = await entityManager.find(EventImage, {
          where: {
            eventId: event.eventId,
            active: true,
          },
          relations: {
            file: true,
          },
        });
        if (
          files.filter((x) => !x.delete).length > 0 &&
          currentImages.length > 0
        ) {
          event = await entityManager.findOne(Events, {
            where: {
              eventId: event.eventId,
            },
          });
          event.thumbnailFile = files[0];
          await entityManager.save(Events, event);
        } else if (
          files.filter((x) => x.delete).length > 0 &&
          currentImages.length > 0
        ) {
          event = await entityManager.findOne(Events, {
            where: {
              eventId: event.eventId,
            },
          });
          event.thumbnailFile = currentImages[0].file;
          await entityManager.save(Events, event);
        } else if (currentImages.length === 0) {
          event = await entityManager.findOne(Events, {
            where: {
              eventId: event.eventId,
            },
          });
          event.thumbnailFile = null;
          await entityManager.save(Events, event);
        }
      }
    } catch (ex) {
      try {
        if (currentBucketFilePath && currentBucketFilePath !== "") {
          const deleteFile = bucket.file(currentBucketFilePath);
          const exists = await deleteFile.exists();
          if (exists[0]) {
            deleteFile.delete();
          }
        }
      } catch (ex) {
        console.log(ex);
      }
      throw ex;
    }
  }

  async logNotification(
    userIds: string[],
    data: Events,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    const users = await entityManager.find(Users, {
      where: {
        userId: In(userIds),
      },
    });

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.EVENTS.toString(),
        referenceId: data.eventCode.toString(),
        isRead: false,
        user: user,
      } as Notifications);
    }
    const res: Notifications[] = await entityManager.save(
      Notifications,
      notifications
    );

    return await entityManager.find(Notifications, {
      where: {
        notificationId: In(res.map(x=> x.notificationId)),
        referenceId: data.eventCode,
        user: {
          userId: In(userIds),
        },
      },
      relations: {
        user: true,
      },
    });
  }
}
