import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { EntityManager, Repository } from "typeorm";
import { Transactions } from "src/db/entities/Transactions";
import { Users } from "src/db/entities/Users";
import { Events } from "src/db/entities/Events";
import { Notifications } from "src/db/entities/Notifications";
import { OneSignalNotificationService } from "./one-signal-notification.service";
export declare class TransactionsService {
    private readonly httpService;
    private readonly config;
    private firebaseProvoder;
    private readonly transactionsRepo;
    private oneSignalNotificationService;
    constructor(httpService: HttpService, config: ConfigService, firebaseProvoder: FirebaseProvider, transactionsRepo: Repository<Transactions>, oneSignalNotificationService: OneSignalNotificationService);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Transactions[];
        total: number;
    }>;
    getByCode(transactionCode: any): Promise<{
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
        event: Events;
        user: Users;
    } | {
        paymentData: {
            id: any;
            checkout_url: any;
            paid: boolean;
            transaction: Transactions;
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
        event: Events;
        user: Users;
    }>;
    requestPaymentLink({ amount, userId, eventId, accountNumber }: {
        amount: any;
        userId: any;
        eventId: any;
        accountNumber: any;
    }): Promise<{
        transactions: Transactions;
        id: any;
        checkout_url: any;
        payment_intent: {
            id: any;
            status: any;
        };
        paid: boolean;
    } | {
        transactions: Transactions;
        id: any;
        checkout_url: any;
        paid: boolean;
        payment_intent?: undefined;
    }>;
    comleteTopUpPayment(transactionCode: any): Promise<void>;
    expirePaymentLink(id: any): Promise<{
        id: any;
        checkout_url: any;
        payment_intent: {
            id: any;
            status: any;
        };
        paid: boolean;
    } | {
        id: any;
        checkout_url: any;
        paid: boolean;
        payment_intent?: undefined;
    }>;
    logNotification(userIds: string[], data: Events, entityManager: EntityManager, title: string, description: string): Promise<Notifications[]>;
}
