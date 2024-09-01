import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { UserConversation } from "src/db/entities/UserConversation";
import { UserConversationService } from "src/services/user-conversation.service";
export declare class UserConversationController {
    private readonly userConversationService;
    constructor(userConversationService: UserConversationService);
    getById(userConversationId: string): Promise<ApiResponseModel<any>>;
    getUnreadByUser(userId: string): Promise<ApiResponseModel<any>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: UserConversation[];
        total: number;
    }>>;
    updateStatus(userConversationId: string): Promise<ApiResponseModel<UserConversation>>;
}
