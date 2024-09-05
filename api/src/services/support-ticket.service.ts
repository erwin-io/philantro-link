import { type } from "os";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { Users } from "src/db/entities/Users";
import { EntityManager, In, Repository } from "typeorm";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import {
  SUPPORT_TICKET_ERROR_NOT_FOUND,
  SUPPORT_TICKET_MESSAGE_ERROR_NOT_FOUND,
  SUPPORT_TICKET_STATUS,
} from "src/common/constant/support-ticket.constant";
import { DateConstant } from "src/common/constant/date.constant";
import { Interested } from "src/db/entities/Interested";
import { Responded } from "src/db/entities/Responded";
import { CreateSupportTicketDto } from "src/core/dto/support-ticket/support-ticket.create.dto";
import {
  UpdateSupportTicketDto,
  UpdateSupportTicketStatusDto,
} from "src/core/dto/support-ticket/support-ticket.update.dto";
import { SupportTicketMessageDto } from "src/core/dto/support-ticket/support-ticket-base.dto";
import { SupportTicketMessage } from "src/db/entities/SupportTicketMessage";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import { NOTIF_TYPE } from "src/common/constant/notifications.constant";
import { Events } from "src/db/entities/Events";
import { Notifications } from "src/db/entities/Notifications";
import { UserConversation } from "src/db/entities/UserConversation";
import { USER_CONVERSATION_TYPE } from "src/common/constant/user-conversation.constant";
import { toPromise } from "../common/utils/utils";

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepo: Repository<SupportTicket>,
    @InjectRepository(SupportTicketMessage)
    private readonly supportTicketMessageRepo: Repository<SupportTicketMessage>,
    @InjectRepository(UserConversation)
    private readonly userConversationRepo: Repository<UserConversation>,
    private oneSignalNotificationService: OneSignalNotificationService
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.supportTicketRepo.find({
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
          assignedAdminUser: {
            userProfilePic: {
              file: true,
            },
          },
        },
      }),
      this.supportTicketRepo.count({
        where: {
          ...condition,
        },
      }),
    ]);
    return {
      results: results.map((res) => {
        delete res.assignedAdminUser?.password;
        delete res.user?.password;
        return {
          ...res,
        };
      }),
      total,
    };
  }

  async getByCode(supportTicketCode = "", currentUserCode = "") {
    const [result, userConversation] = await Promise.all([
      this.supportTicketRepo.findOne({
        where: {
          supportTicketCode: supportTicketCode?.toString()?.toLowerCase(),
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
              type: USER_CONVERSATION_TYPE.SUPPORT_TICKET,
            },
            relations: {
              fromUser: true,
              toUser: true,
            },
          })
        : Promise.resolve(null),
    ]);
    if (!result) {
      throw Error(SUPPORT_TICKET_ERROR_NOT_FOUND);
    }
    delete result.assignedAdminUser?.password;
    delete result.user?.password;
    return {
      ...result,
      userConversation,
    };
  }

  async createSupportTicket(dto: CreateSupportTicketDto) {
    return await this.supportTicketRepo.manager.transaction(
      async (entityManager) => {
        let supportTicket = new SupportTicket();
        supportTicket.type = dto.type;
        supportTicket.title = dto.title;
        supportTicket.description = dto.description;
        const dateTimeSent = moment(
          new Date(dto.dateTimeSent),
          DateConstant.DATE_LANGUAGE
        ).toISOString();
        supportTicket.dateTimeSent = new Date(dateTimeSent);
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
        supportTicket.user = user;
        supportTicket.status = SUPPORT_TICKET_STATUS.OPEN;
        supportTicket = await entityManager.save(supportTicket);
        supportTicket.supportTicketCode = generateIndentityCode(
          supportTicket.supportTicketId
        );
        supportTicket = await entityManager.save(supportTicket);
        supportTicket = await entityManager.findOne(SupportTicket, {
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
          throw Error(SUPPORT_TICKET_ERROR_NOT_FOUND);
        }
        delete supportTicket.user?.password;
        delete supportTicket.assignedAdminUser?.password;
        return supportTicket;
      }
    );
  }

  async updateSupportTicket(supportTicketCode, dto: UpdateSupportTicketDto) {
    return await this.supportTicketRepo.manager.transaction(
      async (entityManager) => {
        let supportTicket = await entityManager.findOne(SupportTicket, {
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
        supportTicket = await entityManager.save(SupportTicket, supportTicket);
        supportTicket = await entityManager.findOne(SupportTicket, {
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
          throw Error(SUPPORT_TICKET_ERROR_NOT_FOUND);
        }
        delete supportTicket.user?.password;
        delete supportTicket.assignedAdminUser?.password;
        return supportTicket;
      }
    );
  }

  async updateStatus(supportTicketCode, dto: UpdateSupportTicketStatusDto) {
    return await this.supportTicketRepo.manager.transaction(
      async (entityManager) => {
        let supportTicket = await entityManager.findOne(SupportTicket, {
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
        const assignedAdminUser = await entityManager.findOne(Users, {
          where: {
            userCode: dto.assignedAdminUserCode,
            userType: USER_TYPE.ADMIN,
            active: true,
          },
        });
        if (!assignedAdminUser) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        supportTicket.assignedAdminUser = assignedAdminUser;
        supportTicket = await entityManager.save(SupportTicket, supportTicket);
        supportTicket = await entityManager.findOne(SupportTicket, {
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
          throw Error(SUPPORT_TICKET_ERROR_NOT_FOUND);
        }
        const title =
          (supportTicket?.status === SUPPORT_TICKET_STATUS.ACTIVE
            ? `Your ticket #${supportTicket?.supportTicketCode} is now active.`
            : "") ||
          (supportTicket?.status === SUPPORT_TICKET_STATUS.COMPLETED
            ? `Your ticket #${supportTicket?.supportTicketCode} has been completed.`
            : "") ||
          (supportTicket?.status === SUPPORT_TICKET_STATUS.CLOSED
            ? `Your ticket #${supportTicket?.supportTicketCode} has been closed.`
            : "");
        const desc =
          (supportTicket?.status === SUPPORT_TICKET_STATUS.ACTIVE
            ? `Your ticket #${supportTicket?.supportTicketCode} is now active. Our support team is currently working on resolving your issue.`
            : "") ||
          (supportTicket?.status === SUPPORT_TICKET_STATUS.COMPLETED
            ? `Your ticket #${supportTicket?.supportTicketCode} has been completed. Please review the resolution and let us know if you need further assistance.`
            : "") ||
          (supportTicket?.status === SUPPORT_TICKET_STATUS.CLOSED
            ? `Your ticket #${supportTicket?.supportTicketCode} has been closed. Thank you for your feedback. We’re here if you need anything else.`
            : "");
        const clientNotifications: Notifications[] = await this.logNotification(
          [supportTicket?.user?.userId],
          supportTicket,
          entityManager,
          title,
          desc
        );

        const pushNotif =
          await this.oneSignalNotificationService.sendToExternalUser(
            supportTicket?.user?.userName,
            NOTIF_TYPE.SUPPORT_TICKET,
            supportTicket.supportTicketCode,
            clientNotifications,
            title,
            desc
          );
        console.log(pushNotif);
        delete supportTicket.user?.password;
        delete supportTicket.assignedAdminUser?.password;
        return supportTicket;
      }
    );
  }

  async getMessagePagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.supportTicketMessageRepo.find({
        where: {
          active: true,
          ...condition,
        },
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
        where: {
          active: true,
          ...condition,
        },
      }),
    ]);
    return {
      results: results.map((res) => {
        delete res.fromUser?.password;
        return {
          ...res,
        };
      }),
      total,
    };
  }

  async postMessage(dto: SupportTicketMessageDto) {
    return await this.supportTicketMessageRepo.manager.transaction(
      async (entityManager) => {
        let supportTicketMessage = new SupportTicketMessage();
        supportTicketMessage.message = dto.message;
        const dateTimeSent = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        supportTicketMessage.dateTimeSent = new Date(dateTimeSent);
        const supportTicket = await entityManager.findOne(SupportTicket, {
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
          throw Error(SUPPORT_TICKET_ERROR_NOT_FOUND);
        }
        supportTicketMessage.supportTicket = supportTicket;
        let fromUser = null;
        let toUser = null;

        if (dto.userCode === supportTicket.user.userCode) {
          fromUser = supportTicket.user;
          toUser = supportTicket.assignedAdminUser;
        } else {
          fromUser = supportTicket.assignedAdminUser;
          toUser = supportTicket.user;
        }
        supportTicketMessage.fromUser = fromUser;
        supportTicketMessage = await entityManager.save(supportTicketMessage);
        supportTicketMessage = await entityManager.findOne(
          SupportTicketMessage,
          {
            where: {
              supportTicketMessageId:
                supportTicketMessage.supportTicketMessageId,
            },
            relations: {
              fromUser: {
                userProfilePic: {
                  file: true,
                },
              },
            },
          }
        );
        if (!supportTicketMessage) {
          throw Error(SUPPORT_TICKET_MESSAGE_ERROR_NOT_FOUND);
        }

        const senderIsAdmin =
          supportTicket?.assignedAdminUser.userCode ===
          supportTicketMessage.fromUser.userCode;

        if (senderIsAdmin) {
          let userConversation = await entityManager.findOne(UserConversation, {
            where: {
              fromUser: {
                userCode: supportTicket?.assignedAdminUser?.userCode,
              },
              referenceId: supportTicket?.supportTicketCode,
              active: true,
              type: USER_CONVERSATION_TYPE.SUPPORT_TICKET,
            },
          });
          if (!userConversation) {
            userConversation = new UserConversation();
            userConversation.fromUser = supportTicket?.assignedAdminUser;
            userConversation.toUser = supportTicket?.user;
            userConversation.referenceId = supportTicket?.supportTicketCode;
            userConversation.type = USER_CONVERSATION_TYPE.SUPPORT_TICKET;
          }
          userConversation.dateTime = new Date(dateTimeSent);
          userConversation.title = supportTicket?.title;
          userConversation.description = `You: ${supportTicketMessage?.message}`;
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );

          userConversation = await entityManager.findOne(UserConversation, {
            where: {
              fromUser: {
                userCode: supportTicket?.user?.userCode,
              },
              referenceId: supportTicket?.supportTicketCode,
              active: true,
              type: USER_CONVERSATION_TYPE.SUPPORT_TICKET,
            },
          });
          if (!userConversation) {
            userConversation = new UserConversation();
            userConversation.fromUser = supportTicket?.user;
            userConversation.toUser = supportTicket?.assignedAdminUser;
            userConversation.referenceId = supportTicket?.supportTicketCode;
            userConversation.type = USER_CONVERSATION_TYPE.SUPPORT_TICKET;
          }

          userConversation.dateTime = new Date(dateTimeSent);
          userConversation.title = supportTicket?.title;
          userConversation.description = `${supportTicket?.assignedAdminUser?.name}: ${supportTicketMessage?.message}`;
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );
        } else {
          let userConversation = await entityManager.findOne(UserConversation, {
            where: {
              fromUser: {
                userCode: supportTicket?.user?.userCode,
              },
              referenceId: supportTicket?.supportTicketCode,
              active: true,
              type: USER_CONVERSATION_TYPE.SUPPORT_TICKET,
            },
          });
          if (!userConversation) {
            userConversation = new UserConversation();
            userConversation.fromUser = supportTicket?.user;
            userConversation.toUser = supportTicket?.assignedAdminUser;
            userConversation.referenceId = supportTicket?.supportTicketCode;
            userConversation.type = USER_CONVERSATION_TYPE.SUPPORT_TICKET;
          }
          userConversation.title = supportTicket?.title;
          userConversation.description = `You: ${supportTicketMessage?.message}`;
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );

          userConversation = await entityManager.findOne(UserConversation, {
            where: {
              fromUser: {
                userCode: supportTicket?.user?.userCode,
              },
              referenceId: supportTicket?.supportTicketCode,
              active: true,
              type: USER_CONVERSATION_TYPE.SUPPORT_TICKET,
            },
          });
          if (!userConversation) {
            userConversation = new UserConversation();
            userConversation.fromUser = supportTicket?.assignedAdminUser;
            userConversation.toUser = supportTicket?.user;
            userConversation.referenceId = supportTicket?.supportTicketCode;
            userConversation.type = USER_CONVERSATION_TYPE.SUPPORT_TICKET;
          }

          userConversation.title = supportTicket?.title;
          userConversation.description = `${supportTicket?.user?.name}: ${supportTicketMessage?.message}`;
          userConversation = await entityManager.save(
            UserConversation,
            userConversation
          );
        }

        const postMessage: {
          userId: string;
          success: boolean;
        } = await this.oneSignalNotificationService.sendToExternalUser(
          toUser?.userName,
          NOTIF_TYPE.MESSAGE,
          supportTicketMessage.supportTicketMessageId,
          [],
          fromUser?.name,
          supportTicketMessage.message
        );
        console.log(postMessage);
        delete supportTicketMessage.fromUser?.password;
        return supportTicketMessage;
      }
    );
  }

  async logNotification(
    userIds: string[],
    data: SupportTicket,
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
        type: NOTIF_TYPE.SUPPORT_TICKET.toString(),
        referenceId: data.supportTicketCode.toString(),
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
        referenceId: data.supportTicketCode,
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
