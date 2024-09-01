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
exports.SupportTicketMessage = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const SupportTicket_1 = require("./SupportTicket");
let SupportTicketMessage = class SupportTicketMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SupportTicketMessageId" }),
    __metadata("design:type", String)
], SupportTicketMessage.prototype, "supportTicketMessageId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Message" }),
    __metadata("design:type", String)
], SupportTicketMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateTimeSent",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], SupportTicketMessage.prototype, "dateTimeSent", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], SupportTicketMessage.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'SENT'" }),
    __metadata("design:type", String)
], SupportTicketMessage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.supportTicketMessages),
    (0, typeorm_1.JoinColumn)([{ name: "FromUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], SupportTicketMessage.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => SupportTicket_1.SupportTicket, (supportTicket) => supportTicket.supportTicketMessages),
    (0, typeorm_1.JoinColumn)([
        { name: "SupportTicketId", referencedColumnName: "supportTicketId" },
    ]),
    __metadata("design:type", SupportTicket_1.SupportTicket)
], SupportTicketMessage.prototype, "supportTicket", void 0);
SupportTicketMessage = __decorate([
    (0, typeorm_1.Index)("SupportTicketMessage_pkey", ["supportTicketMessageId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("SupportTicketMessage", { schema: "dbo" })
], SupportTicketMessage);
exports.SupportTicketMessage = SupportTicketMessage;
//# sourceMappingURL=SupportTicketMessage.js.map