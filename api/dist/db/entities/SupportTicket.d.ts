import { Users } from "./Users";
import { SupportTicketMessage } from "./SupportTicketMessage";
export declare class SupportTicket {
    supportTicketId: string;
    supportTicketCode: string | null;
    title: string;
    description: string;
    dateTimeSent: Date | null;
    status: string;
    lastUpdated: Date | null;
    type: string;
    active: boolean;
    assignedAdminUser: Users;
    user: Users;
    supportTicketMessages: SupportTicketMessage[];
}
