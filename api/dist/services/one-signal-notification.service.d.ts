import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
export declare class OneSignalNotificationService {
    private readonly httpService;
    private readonly config;
    constructor(httpService: HttpService, config: ConfigService);
    sendToExternalUser(userId: string, type: "EVENTS" | "SUPPORT_TICKET" | "MESSAGE" | any, referenceId: any, notificationIds: any[], title: any, description: any): Promise<{
        userId: string;
        success: boolean;
    }>;
    sendToUserWithTags(tags: {
        key: string;
        value: string;
    }[], type: "EVENTS" | "SUPPORT_TICKET" | "MESSAGE" | any, referenceId: any, title: any, description: any): Promise<{
        tags: {
            key: string;
            value: string;
        }[];
        success: boolean;
    }>;
    setExternalUserId(subscriptionId: string, externalUserId: string): Promise<any>;
    setTags(subscriptionId: string, tags: any): Promise<any>;
    reformatArray(inputArray: any): any;
}
