import { Users } from "./Users";
export declare class UserConversation {
    userConversationId: string;
    title: string;
    description: string;
    active: boolean;
    type: string;
    referenceId: string;
    status: string;
    dateTime: Date;
    fromUser: Users;
    toUser: Users;
}
