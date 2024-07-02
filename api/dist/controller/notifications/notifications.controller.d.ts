import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Notifications } from "src/db/entities/Notifications";
import { NotificationsService } from "src/services/notifications.service";
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUnreadByUser(userId: string): Promise<ApiResponseModel<any>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Notifications[];
        total: number;
    }>>;
    updateStatus(notificationId: string): Promise<ApiResponseModel<Notifications>>;
}
