import { CreateAssistanceEventDto, CreateCharityVolunteerEventDto, CreateDonationEventDto } from "src/core/dto/events/events.create.dto";
import { UpdateAssistanceEventDto, UpdateCharityVolunteerEventDto, UpdateDonationEventDto, UpdateEventInterestedDto, UpdateEventRespondedDto, UpdateEventStatusDto } from "src/core/dto/events/events.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Events } from "src/db/entities/Events";
import { EventsService } from "src/services/events.service";
export declare class EventsController {
    private readonly eventService;
    constructor(eventService: EventsService);
    getDetails(eventCode: string, currentUserCode: any): Promise<ApiResponseModel<Events>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Events[];
        total: number;
    }>>;
    createCharityVolunteerEvent(dto: CreateCharityVolunteerEventDto): Promise<ApiResponseModel<Events>>;
    createDonationEvent(dto: CreateDonationEventDto): Promise<ApiResponseModel<Events>>;
    createAssistanceEvent(dto: CreateAssistanceEventDto): Promise<ApiResponseModel<Events>>;
    updateCharityVolunteerEvent(eventCode: string, dto: UpdateCharityVolunteerEventDto): Promise<ApiResponseModel<Events>>;
    updateDonationEvent(eventCode: string, dto: UpdateDonationEventDto): Promise<ApiResponseModel<Events>>;
    updateAssistanceEvent(eventCode: string, dto: UpdateAssistanceEventDto): Promise<ApiResponseModel<Events>>;
    updateStatus(eventCode: string, dto: UpdateEventStatusDto): Promise<ApiResponseModel<Events>>;
    updateEventInterested(eventCode: string, dto: UpdateEventInterestedDto): Promise<ApiResponseModel<Events>>;
    updateEventResponded(eventCode: string, dto: UpdateEventRespondedDto): Promise<ApiResponseModel<Events>>;
}
