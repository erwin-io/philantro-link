import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { SupportTicketMessageDto } from "src/core/dto/support-ticket/support-ticket-base.dto";
import { CreateSupportTicketDto } from "src/core/dto/support-ticket/support-ticket.create.dto";
import { UpdateSupportTicketDto, UpdateSupportTicketStatusDto } from "src/core/dto/support-ticket/support-ticket.update.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SupportTicket } from "src/db/entities/SupportTicket";
import { SupportTicketMessage } from "src/db/entities/SupportTicketMessage";
import { SupportTicketService } from "src/services/support-ticket.service";
export declare class SupportTicketController {
    private readonly supportTicketService;
    constructor(supportTicketService: SupportTicketService);
    getDetails(supportTicketCode: string): Promise<ApiResponseModel<SupportTicket>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: SupportTicket[];
        total: number;
    }>>;
    createSupportTicket(dto: CreateSupportTicketDto): Promise<ApiResponseModel<SupportTicket>>;
    updateSupportTicket(supportTicketCode: string, dto: UpdateSupportTicketDto): Promise<ApiResponseModel<SupportTicket>>;
    updateStatus(supportTicketCode: string, dto: UpdateSupportTicketStatusDto): Promise<ApiResponseModel<SupportTicket>>;
    getMessagePaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: SupportTicketMessage[];
        total: number;
    }>>;
    postMessage(dto: SupportTicketMessageDto): Promise<ApiResponseModel<SupportTicketMessage>>;
}
