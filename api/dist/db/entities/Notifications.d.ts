import { Users } from "./Users";
export declare class Notifications {
    notificationId: string;
    title: string;
    description: string;
    type: string;
    referenceId: string;
    isRead: boolean;
    date: Date;
    tags: string;
    user: Users;
}
