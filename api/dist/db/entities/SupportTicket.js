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
exports.SupportTicket = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
const SupportTicketMessage_1 = require("./SupportTicketMessage");
let SupportTicket = class SupportTicket {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "SupportTicketId" }),
    __metadata("design:type", String)
], SupportTicket.prototype, "supportTicketId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "SupportTicketCode", nullable: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "supportTicketCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Title" }),
    __metadata("design:type", String)
], SupportTicket.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], SupportTicket.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateTimeSent", nullable: true }),
    __metadata("design:type", Date)
], SupportTicket.prototype, "dateTimeSent", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'PENDING'" }),
    __metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "LastUpdated", nullable: true }),
    __metadata("design:type", Date)
], SupportTicket.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Type" }),
    __metadata("design:type", String)
], SupportTicket.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], SupportTicket.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.supportTickets),
    (0, typeorm_1.JoinColumn)([{ name: "AssignedAdminUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], SupportTicket.prototype, "assignedAdminUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.supportTickets2),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], SupportTicket.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SupportTicketMessage_1.SupportTicketMessage, (supportTicketMessage) => supportTicketMessage.supportTicket),
    __metadata("design:type", Array)
], SupportTicket.prototype, "supportTicketMessages", void 0);
SupportTicket = __decorate([
    (0, typeorm_1.Index)("SupportTicket_pkey", ["supportTicketId"], { unique: true }),
    (0, typeorm_1.Entity)("SupportTicket", { schema: "dbo" })
], SupportTicket);
exports.SupportTicket = SupportTicket;
//# sourceMappingURL=SupportTicket.js.map