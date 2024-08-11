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
exports.Events = void 0;
const typeorm_1 = require("typeorm");
const EventImage_1 = require("./EventImage");
const EventMessage_1 = require("./EventMessage");
const Files_1 = require("./Files");
const Users_1 = require("./Users");
const Interested_1 = require("./Interested");
const Responded_1 = require("./Responded");
const Transactions_1 = require("./Transactions");
let Events = class Events {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "EventId" }),
    __metadata("design:type", String)
], Events.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "EventCode", nullable: true }),
    __metadata("design:type", String)
], Events.prototype, "eventCode", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", { name: "DateTime" }),
    __metadata("design:type", Date)
], Events.prototype, "dateTime", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "EventType" }),
    __metadata("design:type", String)
], Events.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "EventName" }),
    __metadata("design:type", String)
], Events.prototype, "eventName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "EventDesc", nullable: true }),
    __metadata("design:type", String)
], Events.prototype, "eventDesc", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "EventLocName" }),
    __metadata("design:type", String)
], Events.prototype, "eventLocName", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "EventLocMap", default: {} }),
    __metadata("design:type", Object)
], Events.prototype, "eventLocMap", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "EventAssistanceItems",
        nullable: true,
        array: true,
        default: () => "'{}'[]",
    }),
    __metadata("design:type", Array)
], Events.prototype, "eventAssistanceItems", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "EventStatus",
        nullable: true,
        default: () => "'PENDING'",
    }),
    __metadata("design:type", String)
], Events.prototype, "eventStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Events.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "TransferType", nullable: true }),
    __metadata("design:type", String)
], Events.prototype, "transferType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "TransferAccountNumber",
        nullable: true,
    }),
    __metadata("design:type", String)
], Events.prototype, "transferAccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "TransferAccountName", nullable: true }),
    __metadata("design:type", String)
], Events.prototype, "transferAccountName", void 0);
__decorate([
    (0, typeorm_1.Column)("numeric", {
        name: "DonationTargetAmount",
        nullable: true,
        default: () => "0",
    }),
    __metadata("design:type", String)
], Events.prototype, "donationTargetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", {
        name: "InProgress",
        nullable: true,
        default: () => "false",
    }),
    __metadata("design:type", Boolean)
], Events.prototype, "inProgress", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EventImage_1.EventImage, (eventImage) => eventImage.event),
    __metadata("design:type", Array)
], Events.prototype, "eventImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EventMessage_1.EventMessage, (eventMessage) => eventMessage.event),
    __metadata("design:type", Array)
], Events.prototype, "eventMessages", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.events),
    (0, typeorm_1.JoinColumn)([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], Events.prototype, "thumbnailFile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.events),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], Events.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Interested_1.Interested, (interested) => interested.event),
    __metadata("design:type", Array)
], Events.prototype, "interesteds", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Responded_1.Responded, (responded) => responded.event),
    __metadata("design:type", Array)
], Events.prototype, "respondeds", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Transactions_1.Transactions, (transactions) => transactions.event),
    __metadata("design:type", Array)
], Events.prototype, "transactions", void 0);
Events = __decorate([
    (0, typeorm_1.Index)("Event_pkey", ["eventId"], { unique: true }),
    (0, typeorm_1.Entity)("Events", { schema: "dbo" })
], Events);
exports.Events = Events;
//# sourceMappingURL=Events.js.map