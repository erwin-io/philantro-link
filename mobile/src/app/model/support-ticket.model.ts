import { UserConversation } from "./user-conversation.model";
import { Users } from "./users";


export class SupportTicket {
  supportTicketId: string;
  supportTicketCode?: string;
  title: string;
  description: string;
  dateTimeSent?: Date;
  status: "OPEN" | "ACTIVE" | "COMPLETED" | "CLOSED";
  lastUpdated?: Date;
  type: "EVENTS" | "TRANSACTIONS" | "OTHERS";
  active: boolean;
  user: Users;
  userConversation: UserConversation;
}


export class SupportTicketMessage {
  supportTicketMessageId?: string;
  message?: string;
  dateTimeSent?: Date;
  active?: boolean;
  fromUser?: Users;
  assignedAdminUser?: Users;
  supportTicket?: SupportTicket;
}
