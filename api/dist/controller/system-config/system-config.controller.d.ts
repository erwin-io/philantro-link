import { ApiResponseModel } from "src/core/models/api-response.model";
import { UpdateSystemConfigDto } from "src/core/dto/system-config/system-config.dto";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { SystemConfigService } from "src/services/system-config.service";
export declare class SystemConfigController {
    private readonly systemConfigService;
    constructor(systemConfigService: SystemConfigService);
    getServerDate(date: any): Promise<ApiResponseModel<any>>;
    getAll(): Promise<ApiResponseModel<SystemConfig[]>>;
    find(key: string): Promise<ApiResponseModel<SystemConfig>>;
    update(dto: UpdateSystemConfigDto): Promise<ApiResponseModel<SystemConfig>>;
}
