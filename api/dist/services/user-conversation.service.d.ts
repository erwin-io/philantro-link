import { UserConversation } from "src/db/entities/UserConversation";
import { EntityManager, Repository } from "typeorm";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { Events } from "src/db/entities/Events";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { EventMessage } from "src/db/entities/EventMessage";
export declare class UserConversationService {
    private readonly userConversationRepo;
    private readonly eventsRepo;
    private readonly eventMessageRepo;
    private readonly supportTicketRepo;
    private oneSignalNotificationService;
    constructor(userConversationRepo: Repository<UserConversation>, eventsRepo: Repository<Events>, eventMessageRepo: Repository<EventMessage>, supportTicketRepo: Repository<SupportTicket>, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: ({
            event: Events;
            unReadMessage: any;
            userConversationId: string;
            title: string;
            description: string;
            active: boolean;
            type: string;
            referenceId: string;
            status: string;
            dateTime: Date;
            fromUser: Users;
            toUser: Users;
        } | {
            supportTicket: SupportTicket;
            userConversationId: string;
            title: string;
            description: string;
            active: boolean;
            type: string;
            referenceId: string;
            status: string;
            dateTime: Date;
            fromUser: Users;
            toUser: Users;
        })[];
        total: number;
    }>;
    getById(userConversationId: any): Promise<{
        event: Events;
        userConversationId: string;
        title: string;
        description: string;
        active: boolean;
        type: string;
        referenceId: string;
        status: string;
        dateTime: Date;
        fromUser: Users;
        toUser: Users;
    } | {
        supportTicket: SupportTicket;
        userConversationId: string;
        title: string;
        description: string;
        active: boolean;
        type: string;
        referenceId: string;
        status: string;
        dateTime: Date;
        fromUser: Users;
        toUser: Users;
    }>;
    getUnreadByUser(userId: string): Promise<number>;
    markAsRead(userConversationId: string): Promise<{
        totalUnreadNotif: number;
        userConversationId: string;
        title: string;
        description: string;
        active: boolean;
        type: string;
        referenceId: string;
        status: string;
        dateTime: Date;
        fromUser: Users;
        toUser: Users;
    }>;
    logNotification(users: Users[], data: UserConversation, entityManager: EntityManager, title: string, description: string): Promise<Notifications[]>;
}
