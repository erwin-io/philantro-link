import { Notifications } from "src/db/entities/Notifications";
import { Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { Users } from "src/db/entities/Users";
export declare class NotificationsService {
    private readonly notificationsRepo;
    private pusherService;
    private oneSignalNotificationService;
    constructor(notificationsRepo: Repository<Notifications>, pusherService: PusherService, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Notifications[];
        total: number;
    }>;
    markAsRead(notificationId: string): Promise<{
        totalUnreadNotif: number;
        notificationId: string;
        title: string;
        description: string;
        type: string;
        referenceId: string;
        isRead: boolean;
        date: Date;
        tags: string;
        user: Users;
    }>;
    getUnreadByUser(userId: string): Promise<number>;
}
