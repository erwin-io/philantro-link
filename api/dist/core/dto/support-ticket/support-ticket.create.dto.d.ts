import { DefaultSupportTicketDto } from "./support-ticket-base.dto";
export declare class CreateSupportTicketDto extends DefaultSupportTicketDto {
    type: "EVENTS" | "TRANSACTIONS";
    dateTimeSent: any;
    userCode: string;
}
