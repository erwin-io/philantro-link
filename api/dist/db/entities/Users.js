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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const EventImage_1 = require("./EventImage");
const EventMessage_1 = require("./EventMessage");
const Events_1 = require("./Events");
const Interested_1 = require("./Interested");
const Notifications_1 = require("./Notifications");
const Responded_1 = require("./Responded");
const SupportTicket_1 = require("./SupportTicket");
const SupportTicketMessage_1 = require("./SupportTicketMessage");
const Transactions_1 = require("./Transactions");
const UserOneSignalSubscription_1 = require("./UserOneSignalSubscription");
const UserProfilePic_1 = require("./UserProfilePic");
const Access_1 = require("./Access");
let Users = class Users {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "UserId" }),
    __metadata("design:type", String)
], Users.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserName" }),
    __metadata("design:type", String)
], Users.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Password" }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "AccessGranted" }),
    __metadata("design:type", Boolean)
], Users.prototype, "accessGranted", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Users.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserCode", nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "userCode", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "UserType" }),
    __metadata("design:type", String)
], Users.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name", default: () => "''" }),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Email" }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("json", { name: "CurrentLocation", nullable: true }),
    __metadata("design:type", Object)
], Users.prototype, "currentLocation", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", {
        name: "HelpNotifPreferences",
        nullable: true,
        array: true,
    }),
    __metadata("design:type", Array)
], Users.prototype, "helpNotifPreferences", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "CurrentOTP", default: () => "0" }),
    __metadata("design:type", String)
], Users.prototype, "currentOtp", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsVerifiedUser", default: () => "false" }),
    __metadata("design:type", Boolean)
], Users.prototype, "isVerifiedUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EventImage_1.EventImage, (eventImage) => eventImage.user),
    __metadata("design:type", Array)
], Users.prototype, "eventImages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EventMessage_1.EventMessage, (eventMessage) => eventMessage.fromUser),
    __metadata("design:type", Array)
], Users.prototype, "eventMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EventMessage_1.EventMessage, (eventMessage) => eventMessage.toUser),
    __metadata("design:type", Array)
], Users.prototype, "eventMessages2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Events_1.Events, (events) => events.user),
    __metadata("design:type", Array)
], Users.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Interested_1.Interested, (interested) => interested.user),
    __metadata("design:type", Interested_1.Interested)
], Users.prototype, "interested", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notifications_1.Notifications, (notifications) => notifications.user),
    __metadata("design:type", Array)
], Users.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Responded_1.Responded, (responded) => responded.user),
    __metadata("design:type", Responded_1.Responded)
], Users.prototype, "responded", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SupportTicket_1.SupportTicket, (supportTicket) => supportTicket.assignedAdminUser),
    __metadata("design:type", Array)
], Users.prototype, "supportTickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SupportTicket_1.SupportTicket, (supportTicket) => supportTicket.user),
    __metadata("design:type", Array)
], Users.prototype, "supportTickets2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SupportTicketMessage_1.SupportTicketMessage, (supportTicketMessage) => supportTicketMessage.fromUser),
    __metadata("design:type", Array)
], Users.prototype, "supportTicketMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Transactions_1.Transactions, (transactions) => transactions.user),
    __metadata("design:type", Array)
], Users.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserOneSignalSubscription_1.UserOneSignalSubscription, (userOneSignalSubscription) => userOneSignalSubscription.user),
    __metadata("design:type", Array)
], Users.prototype, "userOneSignalSubscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserProfilePic_1.UserProfilePic, (userProfilePic) => userProfilePic.user),
    __metadata("design:type", UserProfilePic_1.UserProfilePic)
], Users.prototype, "userProfilePic", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Access_1.Access, (access) => access.users),
    (0, typeorm_1.JoinColumn)([{ name: "AccessId", referencedColumnName: "accessId" }]),
    __metadata("design:type", Access_1.Access)
], Users.prototype, "access", void 0);
Users = __decorate([
    (0, typeorm_1.Index)("u_username", ["active", "userName", "userType"], { unique: true }),
    (0, typeorm_1.Index)("pk_users_1557580587", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("Users", { schema: "dbo" })
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map