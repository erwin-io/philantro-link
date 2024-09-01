import { USER_ERROR_USER_NOT_FOUND } from "../common/constant/user-error.constant";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserConversation } from "src/db/entities/UserConversation";
import { EntityManager, In, Repository } from "typeorm";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { columnDefToTypeORMCondition } from "src/common/utils/utils";
import { Events } from "src/db/entities/Events";
import {
  EVENT_ERROR_NOT_FOUND,
  EVENT_STATUS,
} from "src/common/constant/events.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import {
  NOTIF_TITLE,
  NOTIF_DESCRIPTION,
  NOTIF_TYPE,
} from "src/common/constant/notifications.constant";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
import { USER_CONVERSATION_TYPE } from "src/common/constant/user-conversation.constant";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { EventMessage } from "src/db/entities/EventMessage";
import e from "express";

@Injectable()
export class UserConversationService {
  constructor(
    @InjectRepository(UserConversation)
    private readonly userConversationRepo: Repository<UserConversation>,
    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,
    @InjectRepository(EventMessage)
    private readonly eventMessageRepo: Repository<EventMessage>,
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepo: Repository<SupportTicket>,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    try {
      const skip =
        Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
      const take = Number(pageSize);
      const condition = columnDefToTypeORMCondition(columnDef);
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
          return `
          SELECT ${x.userConversationId} as "userConversationId", e."EventCode" as "referenceId", COUNT("EventMessageId") 
          FROM dbo."EventMessage" em
          LEFT JOIN dbo."Events" e ON em."EventId" = e."EventId"
          WHERE e."EventCode" = '${x.referenceId}' AND em."FromUserId" =${x.toUser?.userId} AND em."ToUserId" = ${x.fromUser?.userId} AND em."Status" IN('SENT', 'DELIVERED') GROUP BY e."EventCode"`;
        })
        .join(" UNION ALL ");

      const referenceRes = await Promise.all([
        this.eventsRepo.find({
          where: {
            eventCode: In(results.map((x) => x.referenceId)),
          },
          relations: {
            user: true,
          },
        }),
        this.supportTicketRepo.find({
          where: {
            supportTicketCode: In(results.map((x) => x.referenceId)),
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
          delete x.fromUser?.password;
          delete x.toUser?.password;
          if (x.type === USER_CONVERSATION_TYPE.EVENTS) {
            return {
              ...x,
              event: referenceRes[0].find((e) => e.eventCode === x.referenceId),
              unReadMessage: referenceRes[2].find(
                (e) =>
                  e.userConversationId.toString() ===
                  x.userConversationId.toString()
              )?.count,
            };
          } else {
            return {
              ...x,
              supportTicket: referenceRes[1].find(
                (s) => s.supportTicketCode === x.referenceId
              ),
            };
          }
        }),
        total,
      };
    } catch (ex) {
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
      if (result.type === USER_CONVERSATION_TYPE.EVENTS) {
        const event = await this.eventsRepo.findOne({
          where: {
            eventCode: result.referenceId,
          },
          relations: {
            user: true,
          },
        });
        return {
          ...result,
          event
        };
      } else {
        const supportTicket = await this.supportTicketRepo.findOne({
          where: {
            supportTicketCode: result.referenceId,
          },
          relations: {
            user: true,
          },
        });
        return {
          ...result,
          supportTicket,
        };
      }
    } catch (ex) {
      throw ex;
    }
  }

  async getUnreadByUser(userId: string) {
    return this.userConversationRepo.count({
      where: {
        fromUser: {
          userId,
          active: true,
        },
        active: true,
        status: In(["SENT", "DELIVERED"]),
      },
    });
  }

  async markAsRead(userConversationId: string) {
    try {
      return await this.userConversationRepo.manager.transaction(
        async (entityManager) => {
          let userConversation = await entityManager.findOne(UserConversation, {
            where: {
              userConversationId,
            },
            relations: {
              fromUser: true,
              toUser: true,
            },
          });
          userConversation.status = "SEEN";
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );
          const event = await entityManager.findOne(Events, {
            where: { eventCode: userConversation?.referenceId },
          });
          await entityManager.query(`
            UPDATE dbo."EventMessage" set "Status" = 'SEEN' WHERE "EventId" = ${event.eventId} 
            AND "FromUserId" = ${userConversation?.toUser?.userId} AND "ToUserId" = ${userConversation?.fromUser?.userId}; 
            `);

          const unReadNotif = await entityManager.count(Notifications, {
            where: {
              user: {
                userId: userConversation?.fromUser?.userId,
                active: true,
              },
              isRead: false,
            },
          });
          const unReadMessage = await entityManager.count(UserConversation, {
            where: {
              fromUser: {
                userId: userConversation?.fromUser?.userId,
                active: true,
              },
              status: In(["SENT", "DELIVERED"]),
              active: true,
            },
          });
          const totalUnreadNotif = Number(unReadNotif) + Number(unReadMessage);
          return {
            ...userConversation,
            totalUnreadNotif,
          };
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async logNotification(
    users: Users[],
    data: UserConversation,
    entityManager: EntityManager,
    title: string,
    description: string
  ) {
    const notifications: Notifications[] = [];

    for (const user of users) {
      notifications.push({
        title,
        description,
        type: NOTIF_TYPE.MESSAGE.toString(),
        referenceId: data.userConversationId.toString(),
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
        notificationId: In(notifications.map((x) => x.notificationId)),
      },
      relations: {
        user: true,
      },
    });
  }
}
