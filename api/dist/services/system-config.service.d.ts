import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { Repository } from "typeorm";
export declare class SystemConfigService {
    private firebaseProvoder;
    private readonly systemConfigRepo;
    constructor(firebaseProvoder: FirebaseProvider, systemConfigRepo: Repository<SystemConfig>);
    getAll(): Promise<SystemConfig[]>;
    update({ key, value }: {
        key: any;
        value: any;
    }): Promise<SystemConfig>;
    find(key: any): Promise<SystemConfig>;
    getServerDate(date: any): Promise<{
        date1: any;
        date2: any;
        dateTime: string;
    }>;
}
