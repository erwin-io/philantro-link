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

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepo: Repository<Events>,
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
        eventImages: {
          file: true,
        },
      },
    });
    if (!result) {
      throw Error(EVENT_ERROR_NOT_FOUND);
    }
    const interested = await this.eventRepo
      .query(
        `SELECT COUNT("EventId") FROM dbo."Interested" WHERE "EventId" = ${result.eventId}`
      )
      .then((res) => {
        return res[0] ? res[0]["count"] ?? 0 : 0;
      });
    const responded = await this.eventRepo
      .query(
        `SELECT COUNT("EventId") FROM dbo."Responded" WHERE "EventId" = ${result.eventId}`
      )
      .then((res) => {
        return res[0] ? res[0]["count"] ?? 0 : 0;
      });

    let raisedDonation = 0;

    raisedDonation = await this.eventRepo
      .query(
        `SELECT SUM("Amount") FROM dbo."Transactions" WHERE "Status" = 'COMPLETED' AND "EventId" = ${result.eventId}`
      )
      .then((res) => {
        return res[0] ? res[0]["sum"] ?? 0 : 0;
      });

    let isCurrentUserInterested = false;
    let isCurrentUserResponded = false;
    if (currentUserCode && currentUserCode !== "") {
      const interestedCount = await this.eventRepo.manager.count(Interested, {
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
      const respondedCount = await this.eventRepo.manager.count(Responded, {
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
    delete result.user?.password;
    return {
      ...result,
      interested,
      responded,
      raisedDonation,
      isCurrentUserResponded,
      isCurrentUserInterested,
    };
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
            .join(
              ","
            )}]::character varying[] && "AssistanceType" AND "Active" = true
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
          eventImages: {
            file: true,
          },
        },
      });
      event.eventName = dto.eventName;
      event.eventDesc = dto.eventDesc;
      event.eventLocName = dto.eventLocName;
      event.eventLocMap = dto.eventLocMap;
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
          eventImages: {
            file: true,
          },
        },
      });

      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
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
          eventImages: {
            file: true,
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
          eventImages: {
            file: true,
          },
        },
      });
      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
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
          eventImages: {
            file: true,
          },
        },
      });
      event.eventName = dto.eventName;
      event.eventDesc = dto.eventDesc;
      event.eventLocName = dto.eventLocName;
      event.eventLocMap = dto.eventLocMap;
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
          eventImages: {
            file: true,
          },
        },
      });
      if (!event) {
        throw Error(EVENT_ERROR_NOT_FOUND);
      }
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
          eventImages: {
            file: true,
          },
        },
      });
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
          event.eventStatus === EVENT_STATUS.PENDING) ||
        (dto.status === EVENT_STATUS.COMPLETED &&
          event.eventStatus === EVENT_STATUS.PENDING)
      ) {
        throw new Error("The event was not yet approved!");
      }
      if (dto.status === EVENT_STATUS.COMPLETED && !event.inProgress) {
        throw new Error("The event was not yet started!");
      }
      event.eventStatus = dto.status;
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
        const forClientTitle = EVENT_STATUS.APPROVED
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
      const event = await entityManager.findOne(Events, {
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
        } else {
          interested = await entityManager.findOne(Interested, {
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
          await entityManager.delete(Interested, interested);
          interestedCount =
            interestedCount && !isNaN(Number(interestedCount))
              ? Number(interestedCount) - 1
              : 0;
        }
      }
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
      const event = await entityManager.findOne(Events, {
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
      delete event.user?.password;
      delete event.user?.password;
      return {
        ...event,
        responded: respondedCount,
      };
    });
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
