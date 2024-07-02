import { CreateEventMessageDto } from "../core/dto/event-message/event-message.create.dto";
import { EventMessage } from "src/db/entities/EventMessage";
import { EntityManager, Repository } from "typeorm";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { Notifications } from "src/db/entities/Notifications";
import { Users } from "src/db/entities/Users";
export declare class EventMessageService {
    private readonly eventMessageRepo;
    private oneSignalNotificationService;
    constructor(eventMessageRepo: Repository<EventMessage>, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: EventMessage[];
        total: number;
    }>;
    getById(id: any): Promise<EventMessage>;
    create(dto: CreateEventMessageDto): Promise<EventMessage>;
    logNotification(users: Users[], data: EventMessage, entityManager: EntityManager, title: string, description: string): Promise<Notifications[]>;
}
