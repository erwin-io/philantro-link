import { Events } from "./Events";
import { Users } from "./Users";
export declare class Transactions {
    transactionId: string;
    transactionCode: string | null;
    dateTime: Date;
    amount: string;
    referenceCode: string;
    paymentType: string;
    fromAccountNumber: string;
    fromAccountName: string;
    toAccountNumber: string;
    toAccountName: string;
    isCompleted: boolean;
    bank: string;
    status: string;
    event: Events;
    user: Users;
}
