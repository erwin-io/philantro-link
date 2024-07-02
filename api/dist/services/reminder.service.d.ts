import { Repository } from "typeorm";
import { PusherService } from "./pusher.service";
import { OneSignalNotificationService } from "./one-signal-notification.service";
import { Notifications } from "src/db/entities/Notifications";
export declare class ReminderService {
    private readonly notificationsRepo;
    private pusherService;
    private oneSignalNotificationService;
    constructor(notificationsRepo: Repository<Notifications>, pusherService: PusherService, oneSignalNotificationService: OneSignalNotificationService);
    sendDueReminder({ date }: {
        date: any;
    }): Promise<void>;
}
