import { CreateEventMessageDto } from "src/core/dto/event-message/event-message.create.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { EventMessage } from "src/db/entities/EventMessage";
import { EventMessageService } from "src/services/event-message.service";
export declare class EventMessageController {
    private readonly eventMessageService;
    constructor(eventMessageService: EventMessageService);
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: EventMessage[];
        total: number;
    }>>;
    create(params: CreateEventMessageDto): Promise<ApiResponseModel<EventMessage>>;
}
