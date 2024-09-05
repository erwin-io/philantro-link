import { USER_ERROR_USER_NOT_FOUND } from "./../common/constant/user-error.constant";
import { CreateEventMessageDto } from "../core/dto/event-message/event-message.create.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventMessage } from "src/db/entities/EventMessage";
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
import { UserConversation } from "src/db/entities/UserConversation";
import { USER_CONVERSATION_TYPE } from "src/common/constant/user-conversation.constant";
import * as moment from "moment-timezone";
@Injectable()
export class EventMessageService {
  constructor(
    @InjectRepository(EventMessage)
    private readonly eventMessageRepo: Repository<EventMessage>,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);
    const condition = columnDefToTypeORMCondition(columnDef);
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
        delete x.toUser?.password;
        delete x.fromUser?.password;
        delete x.event?.user?.password;
        if (x.event?.eventImages) {
          x.event.eventImages = x.event?.eventImages.map((i) => {
            delete i.user?.password;
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

  async create(dto: CreateEventMessageDto) {
    try {
      return await this.eventMessageRepo.manager.transaction(
        async (entityManager) => {
          let eventMessage = new EventMessage();
          const event = await entityManager.findOne(Events, {
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
            throw Error(EVENT_ERROR_NOT_FOUND);
          }

          eventMessage.event = event;
          eventMessage.message = dto.message;
          const fromUser = await entityManager.findOne(Users, {
            where: {
              userCode: dto.fromUserCode,
            },
          });
          eventMessage.fromUser = fromUser;
          if (!fromUser) {
            throw new Error(`Sender ${USER_ERROR_USER_NOT_FOUND}`);
          }
          const toUser = await entityManager.findOne(Users, {
            where: {
              userCode: dto.toUserCode,
            },
          });
          if (!toUser) {
            throw new Error(`Recipient ${USER_ERROR_USER_NOT_FOUND}`);
          }
          eventMessage.toUser = toUser;

          const timestamp = moment.tz("Asia/Manila").toDate();
          eventMessage.dateTimeSent = timestamp;
          eventMessage = await entityManager.save(EventMessage, eventMessage);

          eventMessage = await entityManager.findOne(EventMessage, {
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

          let userConversation = await entityManager.findOne(UserConversation, {
            where: {
              fromUser: {
                userCode: eventMessage.fromUser.userCode,
              },
              toUser: {
                userCode: eventMessage.toUser.userCode,
              },
              referenceId: event.eventCode,
              active: true,
              type: USER_CONVERSATION_TYPE.EVENTS,
            },
          });
          if (!userConversation) {
            userConversation = new UserConversation();
            userConversation.fromUser = eventMessage.fromUser;
            userConversation.toUser = eventMessage.toUser;
            userConversation.referenceId = event.eventCode;
            userConversation.type = USER_CONVERSATION_TYPE.EVENTS;
          }
          userConversation.title =
            event.user?.userCode === eventMessage.fromUser?.userCode
              ? `${eventMessage.toUser?.name}: ${event.eventName}`
              : event.eventName;
          userConversation.description = `You: ${desc}`;
          userConversation.type = USER_CONVERSATION_TYPE.EVENTS;
          userConversation.dateTime = timestamp;
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );

          userConversation = await entityManager.findOne(UserConversation, {
            where: {
              fromUser: {
                userCode: eventMessage.toUser.userCode,
              },
              toUser: {
                userCode: eventMessage.fromUser.userCode,
              },
              referenceId: event.eventCode,
              active: true,
              type: USER_CONVERSATION_TYPE.EVENTS,
            },
          });
          if (!userConversation) {
            userConversation = new UserConversation();
            userConversation.fromUser = eventMessage.toUser;
            userConversation.toUser = eventMessage.fromUser;
            userConversation.referenceId = event.eventCode;
            userConversation.type = USER_CONVERSATION_TYPE.EVENTS;
          }

          userConversation.title =
            event.user?.userCode === eventMessage.toUser?.userCode
              ? `${eventMessage.fromUser?.name}: ${event.eventName}`
              : event.eventName;
          userConversation.description = `${eventMessage.fromUser.name}: ${desc}`;
          userConversation.dateTime = timestamp;
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );

          const pushNotifResults: { userId: string; success: boolean }[] =
            await Promise.all([
              this.oneSignalNotificationService.sendToExternalUser(
                eventMessage.toUser?.userName,
                NOTIF_TYPE.MESSAGE,
                userConversation?.userConversationId,
                [],
                userConversation.title,
                eventMessage.message
              ),
            ]);
          console.log(pushNotifResults);
          delete eventMessage.toUser?.password;
          delete eventMessage.fromUser?.password;
          delete eventMessage.event?.user?.password;
          if (eventMessage.event?.eventImages) {
            eventMessage.event.eventImages =
              eventMessage.event?.eventImages.map((i) => {
                delete i.user?.password;
                return i;
              });
          }
          return eventMessage;
        }
      );
    } catch (ex) {
      throw ex;
    }
  }

  async logNotification(
    users: Users[],
    data: EventMessage,
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
        referenceId: data.eventMessageId.toString(),
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
