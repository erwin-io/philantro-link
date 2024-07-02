import { ApiResponseModel } from "src/core/models/api-response.model";
import { DashboardService } from "src/services/dashboard.service";
export declare class EventsByGeoDto {
    status: string;
    latitude: string;
    longitude: string;
    radius: string;
}
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardUsers(): Promise<ApiResponseModel<any>>;
    getEventsByGeo(params: EventsByGeoDto): Promise<ApiResponseModel<any>>;
}
