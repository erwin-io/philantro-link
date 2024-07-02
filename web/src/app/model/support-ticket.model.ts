import { Users } from "./users";


export class SupportTicket {
  supportTicketId: string;
  supportTicketCode?: string;
  title: string;
  description: string;
  dateTimeSent?: Date;
  status: string;
  lastUpdated?: Date;
  type: string;
  active: boolean;
  user: Users;
}


export class SupportTicketMessage {
  supportTicketMessageId: string;
  message: string;
  dateTimeSent: Date;
  active: boolean;
  fromUser: Users;
  assignedAdminUser: Users;
  supportTicket: SupportTicket;
}
