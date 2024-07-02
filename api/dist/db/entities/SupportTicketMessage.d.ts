import { Users } from "./Users";
import { SupportTicket } from "./SupportTicket";
export declare class SupportTicketMessage {
    supportTicketMessageId: string;
    message: string;
    dateTimeSent: Date;
    active: boolean;
    fromUser: Users;
    supportTicket: SupportTicket;
}
