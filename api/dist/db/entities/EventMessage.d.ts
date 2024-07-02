import { Events } from "./Events";
import { Users } from "./Users";
export declare class EventMessage {
    eventMessageId: string;
    message: string;
    dateTimeSent: Date;
    status: string;
    lastUpdated: Date;
    active: boolean;
    event: Events;
    fromUser: Users;
    toUser: Users;
}
