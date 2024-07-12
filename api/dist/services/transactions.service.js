"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_1 = require("../core/provider/firebase/firebase-provider");
const typeorm_2 = require("typeorm");
const Transactions_1 = require("../db/entities/Transactions");
const payment_constant_1 = require("../common/constant/payment.constant");
const timestamp_constant_1 = require("../common/constant/timestamp.constant");
const Users_1 = require("../db/entities/Users");
const user_error_constant_1 = require("../common/constant/user-error.constant");
const utils_1 = require("../common/utils/utils");
const Events_1 = require("../db/entities/Events");
const events_constant_1 = require("../common/constant/events.constant");
const user_type_constant_1 = require("../common/constant/user-type.constant");
let TransactionsService = class TransactionsService {
    constructor(httpService, config, firebaseProvoder, transactionsRepo) {
        this.httpService = httpService;
        this.config = config;
        this.firebaseProvoder = firebaseProvoder;
        this.transactionsRepo = transactionsRepo;
    }
    async getPagination({ pageSize, pageIndex, order, columnDef }) {
        const skip = Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
        const take = Number(pageSize);
        const condition = (0, utils_1.columnDefToTypeORMCondition)(columnDef);
        const [results, total] = await Promise.all([
            this.transactionsRepo.find({
                where: Object.assign({ isCompleted: true, status: "COMPLETED" }, condition),
                relations: {
                    user: {
                        userProfilePic: true,
                    },
                },
                skip,
                take,
                order,
            }),
            this.transactionsRepo.count({
                where: Object.assign({ isCompleted: true, status: "COMPLETED" }, condition),
            }),
        ]);
        return {
            results: results.map((x) => {
                var _a;
                (_a = x.user) === null || _a === void 0 ? true : delete _a.password;
                return x;
            }),
            total,
        };
    }
    async getByCode(transactionCode) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const transaction = await this.transactionsRepo.findOne({
                where: {
                    transactionCode,
                },
                relations: {
                    user: true,
                    event: {
                        user: true,
                    },
                },
            });
            if (!transaction) {
                throw new Error("Transaction not found!");
            }
            delete transaction.user.password;
            if (!(transaction === null || transaction === void 0 ? void 0 : transaction.referenceCode) && (transaction === null || transaction === void 0 ? void 0 : transaction.referenceCode) === "") {
                throw new Error("Transaction payment data not valid!");
            }
            const base64data = new Buffer(this.config.get("PAYMENT_SECRET_KEY")).toString("base64");
            const result = await this.httpService
                .get(`https://api.paymongo.com/v1/checkout_sessions/${transaction === null || transaction === void 0 ? void 0 : transaction.referenceCode}`, {
                responseType: "json",
                headers: {
                    Origin: "https://api.paymongo.com",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${base64data}`,
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                if (error.response &&
                    ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) &&
                    ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errors) &&
                    ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.errors[0]) &&
                    ((_h = (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors[0]) === null || _h === void 0 ? void 0 : _h.detail) &&
                    ((_l = (_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.errors[0]) === null || _l === void 0 ? void 0 : _l.detail) !== "") {
                    let message = (_p = (_o = (_m = error.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.errors[0]) === null || _p === void 0 ? void 0 : _p.detail;
                    if (message.includes("No") &&
                        message.includes("No such") &&
                        message.includes("checkout") &&
                        message.includes("session") &&
                        message.includes("id") &&
                        message.includes(transaction === null || transaction === void 0 ? void 0 : transaction.referenceCode)) {
                        message =
                            "We apologize, but we couldn't locate your payment in our database";
                    }
                    throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                }
                else if (error.message && error.message !== "") {
                    throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw new common_1.HttpException("Bad request!", common_1.HttpStatus.BAD_REQUEST);
                }
            }))
                .toPromise();
            if ((result === null || result === void 0 ? void 0 : result.data) &&
                ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data) &&
                ((_c = (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.attributes)) {
                const { checkout_url, payments, payment_intent } = (_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.attributes;
                if (payment_intent &&
                    (payment_intent === null || payment_intent === void 0 ? void 0 : payment_intent.attributes) &&
                    ((_f = payment_intent === null || payment_intent === void 0 ? void 0 : payment_intent.attributes) === null || _f === void 0 ? void 0 : _f.status)) {
                    return Object.assign(Object.assign({}, transaction), { paymentData: {
                            id: (_h = (_g = result === null || result === void 0 ? void 0 : result.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.id,
                            checkout_url,
                            payment_intent: {
                                id: payment_intent.id,
                                status: (_j = payment_intent.attributes) === null || _j === void 0 ? void 0 : _j.status,
                            },
                            paid: payments && payments.length > 0,
                        } });
                }
                else {
                    return Object.assign(Object.assign({}, transaction), { paymentData: {
                            id: (_l = (_k = result === null || result === void 0 ? void 0 : result.data) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.id,
                            checkout_url,
                            paid: payments && payments.length > 0,
                            transaction,
                        } });
                }
            }
            else {
                return null;
            }
        }
        catch (ex) {
            throw ex;
        }
    }
    async requestPaymentLink({ amount, userId, eventId }) {
        return await this.transactionsRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            try {
                let transactions = new Transactions_1.Transactions();
                const timestamp = await entityManager
                    .query(timestamp_constant_1.CONST_QUERYCURRENT_TIMESTAMP)
                    .then((res) => {
                    return res[0]["timestamp"];
                });
                transactions.dateTime = timestamp;
                transactions.amount = amount;
                const event = await entityManager.findOne(Events_1.Events, {
                    where: {
                        eventId,
                    },
                });
                if (!event) {
                    throw new common_1.HttpException(events_constant_1.EVENT_ERROR_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
                }
                if (event.eventType !== events_constant_1.EVENT_TYPE.DONATION) {
                    throw new common_1.HttpException("The selected event is not a donation type of event!", common_1.HttpStatus.BAD_REQUEST);
                }
                if (!event.transferType ||
                    event.transferType === "" ||
                    !event.transferAccountName ||
                    !event.transferAccountNumber ||
                    ![
                        payment_constant_1.PAYMENT_METHOD.CARD,
                        payment_constant_1.PAYMENT_METHOD.CASH,
                        payment_constant_1.PAYMENT_METHOD.WALLET,
                    ].some((x) => x === event.transferType.toUpperCase())) {
                    throw new common_1.HttpException("The selected donation event has an invalid receiving account setup!", common_1.HttpStatus.BAD_REQUEST);
                }
                transactions.event = event;
                const user = await entityManager.findOne(Users_1.Users, {
                    where: {
                        userId,
                    },
                });
                if (!user) {
                    throw new common_1.HttpException(user_error_constant_1.USER_ERROR_USER_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
                }
                if (user.userType !== user_type_constant_1.USER_TYPE.CLIENT) {
                    throw new common_1.HttpException("Invalid user type", common_1.HttpStatus.BAD_REQUEST);
                }
                transactions.user = user;
                transactions.paymentType = payment_constant_1.PAYMENT_METHOD.WALLET;
                transactions.fromAccountNumber = user.mobileNumber;
                transactions.fromAccountName = user.name;
                transactions.toAccountNumber = event.transferAccountNumber;
                transactions.toAccountName = event.transferAccountName;
                transactions.bank = "ONLINE";
                transactions = await entityManager.save(Transactions_1.Transactions, transactions);
                transactions.transactionCode = (0, utils_1.generateIndentityCode)(transactions.transactionId);
                transactions = await entityManager.save(Transactions_1.Transactions, transactions);
                const params = {
                    data: {
                        attributes: {
                            send_email_receipt: false,
                            show_description: true,
                            show_line_items: false,
                            payment_method_types: ["gcash", "grab_pay", "paymaya"],
                            line_items: [
                                {
                                    currency: "PHP",
                                    amount: Number(amount) * 100,
                                    quantity: 1,
                                    name: "Top up",
                                },
                            ],
                            description: "Top up",
                            success_url: `${this.config.get("PAYMENT_SUCCESS_PAGE")}/${transactions.transactionCode}`,
                        },
                    },
                };
                const base64data = new Buffer(this.config.get("PAYMENT_SECRET_KEY")).toString("base64");
                const result = await (0, rxjs_1.firstValueFrom)(this.httpService
                    .post(`https://api.paymongo.com/v1/checkout_sessions`, params, {
                    responseType: "json",
                    headers: {
                        Origin: "https://api.paymongo.com",
                        "Content-Type": "application/json",
                        Authorization: `Basic ${base64data}`,
                    },
                })
                    .pipe((0, rxjs_1.catchError)((error) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    if (error.response &&
                        ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) &&
                        ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errors) &&
                        ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.errors[0]) &&
                        ((_h = (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors[0]) === null || _h === void 0 ? void 0 : _h.detail) &&
                        ((_l = (_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.errors[0]) === null || _l === void 0 ? void 0 : _l.detail) !== "") {
                        let message = (_p = (_o = (_m = error.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.errors[0]) === null || _p === void 0 ? void 0 : _p.detail;
                        if (message.includes("total") &&
                            message.includes("amount") &&
                            message.includes("cannot") &&
                            message.includes("less")) {
                            message = "The total amount cannot be less than 20";
                        }
                        throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                    }
                    else if (error.message && error.message !== "") {
                        throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
                    }
                    else {
                        throw new common_1.HttpException("Bad request!", common_1.HttpStatus.BAD_REQUEST);
                    }
                })));
                if ((result === null || result === void 0 ? void 0 : result.data) &&
                    ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data) &&
                    ((_c = (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.attributes)) {
                    const { checkout_url, payments, payment_intent } = (_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.attributes;
                    if (((_g = (_f = result === null || result === void 0 ? void 0 : result.data) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.id) &&
                        payment_intent &&
                        (payment_intent === null || payment_intent === void 0 ? void 0 : payment_intent.attributes) &&
                        ((_h = payment_intent === null || payment_intent === void 0 ? void 0 : payment_intent.attributes) === null || _h === void 0 ? void 0 : _h.status)) {
                        transactions.referenceCode = (_k = (_j = result === null || result === void 0 ? void 0 : result.data) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.id;
                        transactions = await entityManager.save(Transactions_1.Transactions, transactions);
                        return {
                            transactions,
                            id: (_m = (_l = result === null || result === void 0 ? void 0 : result.data) === null || _l === void 0 ? void 0 : _l.data) === null || _m === void 0 ? void 0 : _m.id,
                            checkout_url,
                            payment_intent: {
                                id: payment_intent.id,
                                status: payment_intent.status,
                            },
                            paid: payments && payments.length > 0,
                        };
                    }
                    else {
                        transactions.referenceCode = (_p = (_o = result === null || result === void 0 ? void 0 : result.data) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p.id;
                        transactions = await entityManager.save(Transactions_1.Transactions, transactions);
                        return {
                            transactions,
                            id: (_r = (_q = result === null || result === void 0 ? void 0 : result.data) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.id,
                            checkout_url,
                            paid: payments && payments.length > 0,
                        };
                    }
                }
                else {
                    throw new common_1.HttpException("Sorry, we encountered an error processing your payment. Please try again later", common_1.HttpStatus.BAD_REQUEST);
                }
            }
            catch (ex) {
                throw ex;
            }
        });
    }
    async comleteTopUpPayment(transactionCode) {
        return await this.transactionsRepo.manager.transaction(async (entityManager) => {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const getTransaction = await this.getByCode(transactionCode);
                if ((getTransaction &&
                    (getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) &&
                    ((_a = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _a === void 0 ? void 0 : _a.id) &&
                    ((_b = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _b === void 0 ? void 0 : _b.id) !== "",
                    (_c = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _c === void 0 ? void 0 : _c.paid)) {
                    let transaction = await entityManager.findOne(Transactions_1.Transactions, {
                        where: {
                            transactionCode,
                        },
                    });
                    if (!transaction) {
                        throw new common_1.HttpException("We apologize, but we couldn't locate your payment in our database. Kindly wait for a moment and attempt the transaction again shortly.", common_1.HttpStatus.BAD_REQUEST);
                    }
                    if (((_d = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _d === void 0 ? void 0 : _d.paid) ||
                        ((_e = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _e === void 0 ? void 0 : _e.payment_intent.status) ===
                            payment_constant_1.PAYMENT_LINK_STATUS.SUCCEEDED) {
                        transaction.isCompleted = true;
                        transaction.status = payment_constant_1.PAYMENT_STATUS.COMPLETED;
                        transaction = await entityManager.save(Transactions_1.Transactions, transaction);
                        transaction = await entityManager.findOne(Transactions_1.Transactions, {
                            where: {
                                transactionId: transaction.transactionId,
                            },
                            relations: {
                                user: true,
                            },
                        });
                    }
                    else if (((_f = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _f === void 0 ? void 0 : _f.paid) ||
                        ((_g = getTransaction === null || getTransaction === void 0 ? void 0 : getTransaction.paymentData) === null || _g === void 0 ? void 0 : _g.payment_intent.status) ===
                            payment_constant_1.PAYMENT_LINK_STATUS.WAITING_PAYMENT) {
                        throw new common_1.HttpException("We're sorry, but your payment hasn't been confirmed or completed yet. Please wait a few moments and try again later.", common_1.HttpStatus.BAD_REQUEST);
                    }
                    else {
                        throw new common_1.HttpException("Sorry, we encountered an error processing your payment. Please try again later", common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                else {
                    throw new common_1.HttpException("Sorry, we encountered an error processing your payment. Please try again later", common_1.HttpStatus.BAD_REQUEST);
                }
            }
            catch (ex) {
                throw ex;
            }
        });
    }
    async expirePaymentLink(id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        try {
            const base64data = new Buffer("sk_test_PaJ2xyGtup94CxoLHLQRmHVz").toString("base64");
            const result = await (0, rxjs_1.firstValueFrom)(this.httpService
                .post(`https://api.paymongo.com/v1/checkout_sessions/${id}/expire`, {}, {
                responseType: "json",
                headers: {
                    Origin: "https://api.paymongo.com",
                    "Content-Type": "application/json",
                    Authorization: `Basic ${base64data}`,
                },
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                if (error.response &&
                    ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) &&
                    ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errors) &&
                    ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.errors[0]) &&
                    ((_h = (_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors[0]) === null || _h === void 0 ? void 0 : _h.detail) &&
                    ((_l = (_k = (_j = error.response) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.errors[0]) === null || _l === void 0 ? void 0 : _l.detail) !== "") {
                    let message = (_p = (_o = (_m = error.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.errors[0]) === null || _p === void 0 ? void 0 : _p.detail;
                    if (message.includes("Checkout") &&
                        message.includes("Session") &&
                        message.includes("already") &&
                        message.includes("expired") &&
                        message.includes(id)) {
                        message = "Payment already cancelled!";
                    }
                    throw new common_1.HttpException(message, common_1.HttpStatus.BAD_REQUEST);
                }
                else if (error.message && error.message !== "") {
                    throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
                }
                else {
                    throw new common_1.HttpException("Bad request!", common_1.HttpStatus.BAD_REQUEST);
                }
            })));
            if ((result === null || result === void 0 ? void 0 : result.data) &&
                ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data) &&
                ((_c = (_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.attributes)) {
                const { checkout_url, payments, payment_intent } = (_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.attributes;
                if (payment_intent &&
                    (payment_intent === null || payment_intent === void 0 ? void 0 : payment_intent.attributes) &&
                    ((_f = payment_intent === null || payment_intent === void 0 ? void 0 : payment_intent.attributes) === null || _f === void 0 ? void 0 : _f.status)) {
                    return {
                        id: (_h = (_g = result === null || result === void 0 ? void 0 : result.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.id,
                        checkout_url,
                        payment_intent: {
                            id: payment_intent.id,
                            status: payment_intent.status,
                        },
                        paid: payments && payments.length > 0,
                    };
                }
                else {
                    return {
                        id: (_k = (_j = result === null || result === void 0 ? void 0 : result.data) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.id,
                        checkout_url,
                        paid: payments && payments.length > 0,
                    };
                }
            }
            else {
                return null;
            }
        }
        catch (ex) {
            throw ex;
        }
    }
};
TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(Transactions_1.Transactions)),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        firebase_provider_1.FirebaseProvider,
        typeorm_2.Repository])
], TransactionsService);
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map