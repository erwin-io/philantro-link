import { DefaultSupportTicketDto } from "./support-ticket-base.dto";
export declare class UpdateSupportTicketDto extends DefaultSupportTicketDto {
}
export declare class UpdateSupportTicketStatusDto {
    status: "OPEN" | "ACTIVE" | "COMPLETED" | "CLOSED";
    assignedAdminUserCode: string;
}
