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
exports.EventMessage = void 0;
const typeorm_1 = require("typeorm");
const Events_1 = require("./Events");
const Users_1 = require("./Users");
let EventMessage = class EventMessage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "EventMessageId" }),
    __metadata("design:type", String)
], EventMessage.prototype, "eventMessageId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Message" }),
    __metadata("design:type", String)
], EventMessage.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "DateTimeSent",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], EventMessage.prototype, "dateTimeSent", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'SENT'" }),
    __metadata("design:type", String)
], EventMessage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "LastUpdated",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], EventMessage.prototype, "lastUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], EventMessage.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Events_1.Events, (events) => events.eventMessages),
    (0, typeorm_1.JoinColumn)([{ name: "EventId", referencedColumnName: "eventId" }]),
    __metadata("design:type", Events_1.Events)
], EventMessage.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.eventMessages),
    (0, typeorm_1.JoinColumn)([{ name: "FromUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], EventMessage.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.eventMessages2),
    (0, typeorm_1.JoinColumn)([{ name: "ToUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], EventMessage.prototype, "toUser", void 0);
EventMessage = __decorate([
    (0, typeorm_1.Index)("EventMessage_pkey", ["eventMessageId"], { unique: true }),
    (0, typeorm_1.Entity)("EventMessage", { schema: "dbo" })
], EventMessage);
exports.EventMessage = EventMessage;
//# sourceMappingURL=EventMessage.js.map