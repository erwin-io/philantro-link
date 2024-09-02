import { Events } from "./events.model";
import { SupportTicket } from "./support-ticket.model";
import { Users } from "./users";

export class UserConversation {
    userConversationId: string;
    referenceId: string;
    title: string;
    description: string;
    active: boolean;
    type: string;
    fromUser: Users;
    toUser: Users;
    status?: "SENT" | "SEEN" | "DELIVERED";
    event: Events;
    supportTicket: SupportTicket;
    unReadMessage: number = 0;
    totalUnreadNotif: number = 0;
  }
  