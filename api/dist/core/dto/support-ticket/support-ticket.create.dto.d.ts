import { DefaultSupportTicketDto } from "./support-ticket-base.dto";
export declare class CreateSupportTicketDto extends DefaultSupportTicketDto {
    type: "EVENTS" | "TRANSACTIONS" | "OTHERS";
    dateTimeSent: any;
    userCode: string;
}
