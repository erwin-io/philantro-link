import { TransactionsService } from "src/services/transactions.service";
export declare class PaymentDoneController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    get(req: any): Promise<{
        transaction: {
            paymentData: {
                id: any;
                checkout_url: any;
                payment_intent: {
                    id: any;
                    status: any;
                };
                paid: boolean;
                transaction?: undefined;
            };
            transactionId: string;
            transactionCode: string;
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
            event: import("../../db/entities/Events").Events;
            user: import("../../db/entities/Users").Users;
        } | {
            paymentData: {
                id: any;
                checkout_url: any;
                paid: boolean;
                transaction: import("../../db/entities/Transactions").Transactions;
                payment_intent?: undefined;
            };
            transactionId: string;
            transactionCode: string;
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
            event: import("../../db/entities/Events").Events;
            user: import("../../db/entities/Users").Users;
        };
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        invalidUrl?: undefined;
    } | {
        invalidUrl: boolean;
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        transaction?: undefined;
    }>;
    getByCode(transactionCode: string): Promise<{
        transaction: {
            paymentData: {
                id: any;
                checkout_url: any;
                payment_intent: {
                    id: any;
                    status: any;
                };
                paid: boolean;
                transaction?: undefined;
            };
            transactionId: string;
            transactionCode: string;
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
            event: import("../../db/entities/Events").Events;
            user: import("../../db/entities/Users").Users;
        } | {
            paymentData: {
                id: any;
                checkout_url: any;
                paid: boolean;
                transaction: import("../../db/entities/Transactions").Transactions;
                payment_intent?: undefined;
            };
            transactionId: string;
            transactionCode: string;
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
            event: import("../../db/entities/Events").Events;
            user: import("../../db/entities/Users").Users;
        };
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        invalidUrl?: undefined;
    } | {
        invalidUrl: boolean;
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        transaction?: undefined;
    }>;
    paymentDetails(transactionCode: any): Promise<{
        transaction: {
            paymentData: {
                id: any;
                checkout_url: any;
                payment_intent: {
                    id: any;
                    status: any;
                };
                paid: boolean;
                transaction?: undefined;
            };
            transactionId: string;
            transactionCode: string;
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
            event: import("../../db/entities/Events").Events;
            user: import("../../db/entities/Users").Users;
        } | {
            paymentData: {
                id: any;
                checkout_url: any;
                paid: boolean;
                transaction: import("../../db/entities/Transactions").Transactions;
                payment_intent?: undefined;
            };
            transactionId: string;
            transactionCode: string;
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
            event: import("../../db/entities/Events").Events;
            user: import("../../db/entities/Users").Users;
        };
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        invalidUrl?: undefined;
    } | {
        invalidUrl: boolean;
        title: string;
        cssFile: string;
        jsFile: string;
        layout: string;
        transaction?: undefined;
    }>;
}
