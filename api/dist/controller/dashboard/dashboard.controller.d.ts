import { ApiResponseModel } from "src/core/models/api-response.model";
import { DashboardService } from "src/services/dashboard.service";
export declare class EventsByGeoDto {
    status: string;
    latitude: string;
    longitude: string;
    radius: string;
}
export declare class ClientEventFeedDto {
    latitude: number;
    longitude: number;
    radius: number;
    eventType: string[];
    skip: number;
    limit: number;
    userCode: string;
}
export declare class ClientHelpFeedDto {
    latitude: number;
    longitude: number;
    radius: number;
    helpType: string[];
    skip: number;
    limit: number;
    userCode: string;
}
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardUsers(): Promise<ApiResponseModel<any>>;
    getEventsByGeo(params: EventsByGeoDto): Promise<ApiResponseModel<any>>;
    getClientEventFeed(params: ClientEventFeedDto): Promise<ApiResponseModel<{
        results: any[];
        total: any;
    }>>;
    getClientHelpFeed(params: ClientHelpFeedDto): Promise<ApiResponseModel<{
        results: any[];
        total: any;
    }>>;
}
