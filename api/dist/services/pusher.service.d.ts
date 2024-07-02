import { ConfigService } from "@nestjs/config";
export declare class PusherService {
    private readonly config;
    pusher: any;
    constructor(config: ConfigService);
    trigger(channel: any, event: any, data: any): void;
    reSync(type: string, data: any): Promise<void>;
    rentBookingChanges(userIds: string[], data: any): Promise<void>;
    rentContractChanges(userIds: string[], data: any): Promise<void>;
    billingChanges(userIds: string[], data: any): Promise<void>;
    paymentChanges(userIds: string[], data: any): Promise<void>;
    sendNotif(userIds: string[], title: string, description: any): Promise<void>;
}
