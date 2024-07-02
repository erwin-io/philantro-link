import { Events } from "./Events";
import { Files } from "./Files";
import { Users } from "./Users";
export declare class EventImage {
    eventId: string;
    fileId: string;
    active: boolean;
    event: Events;
    file: Files;
    user: Users;
}
