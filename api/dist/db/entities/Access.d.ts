import { Users } from "./Users";
export declare class Access {
    accessId: string;
    name: string;
    accessPages: object;
    active: boolean;
    accessCode: string | null;
    users: Users[];
}
