import { SupportTicket } from "src/db/entities/SupportTicket";
import { Users } from "src/db/entities/Users";
import { EntityManager, Repository } from "typeorm";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { CreateSupportTicketDto } from "src/core/dto/support-ticket/support-ticket.create.dto";
import { UpdateSupportTicketDto, UpdateSupportTicketStatusDto } from "src/core/dto/support-ticket/support-ticket.update.dto";
import { SupportTicketMessageDto } from "src/core/dto/support-ticket/support-ticket-base.dto";
import { SupportTicketMessage } from "src/db/entities/SupportTicketMessage";
import { Notifications } from "src/db/entities/Notifications";
export declare class SupportTicketService {
    private readonly supportTicketRepo;
    private readonly supportTicketMessageRepo;
    private oneSignalNotificationService;
    constructor(supportTicketRepo: Repository<SupportTicket>, supportTicketMessageRepo: Repository<SupportTicketMessage>, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: {
            supportTicketId: string;
            supportTicketCode: string;
            title: string;
            description: string;
            dateTimeSent: Date;
            status: string;
            lastUpdated: Date;
            type: string;
            active: boolean;
            assignedAdminUser: Users;
            user: Users;
            supportTicketMessages: SupportTicketMessage[];
        }[];
        total: number;
    }>;
    getByCode(supportTicketCode?: string): Promise<SupportTicket>;
    createSupportTicket(dto: CreateSupportTicketDto): Promise<SupportTicket>;
    updateSupportTicket(supportTicketCode: any, dto: UpdateSupportTicketDto): Promise<SupportTicket>;
    updateStatus(supportTicketCode: any, dto: UpdateSupportTicketStatusDto): Promise<SupportTicket>;
    getMessagePagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: {
            supportTicketMessageId: string;
            message: string;
            dateTimeSent: Date;
            active: boolean;
            fromUser: Users;
            supportTicket: SupportTicket;
        }[];
        total: number;
    }>;
    postMessage(dto: SupportTicketMessageDto): Promise<SupportTicketMessage>;
    logNotification(userIds: string[], data: SupportTicket, entityManager: EntityManager, title: string, description: string): Promise<Notifications[]>;
}
