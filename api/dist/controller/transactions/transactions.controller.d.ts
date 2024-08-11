import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { Transactions } from "src/db/entities/Transactions";
import { TransactionsService } from "src/services/transactions.service";
export declare class RequestPaymentDto {
    amount: number;
    userId: string;
    eventId: string;
    accountNumber: string;
}
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getByCode(transactionCode: string): Promise<ApiResponseModel<any>>;
    getPaginated(params: PaginationParamsDto): Promise<ApiResponseModel<{
        results: Transactions[];
        total: number;
    }>>;
    requestPaymentLink(params: RequestPaymentDto): Promise<ApiResponseModel<any>>;
    comleteTopUpPayment(paymentReferenceCode: string): Promise<ApiResponseModel<any>>;
    expirePaymentLink(id: string): Promise<ApiResponseModel<any>>;
}
