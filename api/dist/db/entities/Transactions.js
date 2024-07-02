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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactions = void 0;
const typeorm_1 = require("typeorm");
const Events_1 = require("./Events");
const Users_1 = require("./Users");
let Transactions = class Transactions {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "TransactionId" }),
    __metadata("design:type", String)
], Transactions.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "TransactionCode", nullable: true }),
    __metadata("design:type", String)
], Transactions.prototype, "transactionCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateTime",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], Transactions.prototype, "dateTime", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", { name: "Amount", default: () => "0" }),
    __metadata("design:type", String)
], Transactions.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ReferenceCode", default: () => "''" }),
    __metadata("design:type", String)
], Transactions.prototype, "referenceCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "PaymentType", default: () => "'CASH'" }),
    __metadata("design:type", String)
], Transactions.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "FromAccountNumber",
        default: () => "'NA'",
    }),
    __metadata("design:type", String)
], Transactions.prototype, "fromAccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "FromAccountName",
        default: () => "'NA'",
    }),
    __metadata("design:type", String)
], Transactions.prototype, "fromAccountName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "ToAccountNumber",
        default: () => "'NA'",
    }),
    __metadata("design:type", String)
], Transactions.prototype, "toAccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ToAccountName", default: () => "'NA'" }),
    __metadata("design:type", String)
], Transactions.prototype, "toAccountName", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsCompleted", default: () => "false" }),
    __metadata("design:type", Boolean)
], Transactions.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Bank", default: () => "'ONLINE'" }),
    __metadata("design:type", String)
], Transactions.prototype, "bank", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], Transactions.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Events_1.Events, (events) => events.transactions),
    (0, typeorm_1.JoinColumn)([{ name: "EventId", referencedColumnName: "eventId" }]),
    __metadata("design:type", Events_1.Events)
], Transactions.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.transactions),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], Transactions.prototype, "user", void 0);
Transactions = __decorate([
    (0, typeorm_1.Index)("Transactions_pkey", ["transactionId"], { unique: true }),
    (0, typeorm_1.Entity)("Transactions", { schema: "dbo" })
], Transactions);
exports.Transactions = Transactions;
//# sourceMappingURL=Transactions.js.map