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
exports.Notifications = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let Notifications = class Notifications {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "NotificationId" }),
    __metadata("design:type", String)
], Notifications.prototype, "notificationId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Title" }),
    __metadata("design:type", String)
], Notifications.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], Notifications.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Type" }),
    __metadata("design:type", String)
], Notifications.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ReferenceId" }),
    __metadata("design:type", String)
], Notifications.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "IsRead", default: () => "false" }),
    __metadata("design:type", Boolean)
], Notifications.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "Date",
        default: () => "(now() AT TIME ZONE 'Asia/Manila')",
    }),
    __metadata("design:type", Date)
], Notifications.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Tags", default: () => "''" }),
    __metadata("design:type", String)
], Notifications.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.notifications),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], Notifications.prototype, "user", void 0);
Notifications = __decorate([
    (0, typeorm_1.Index)("Notifications_pkey", ["notificationId"], { unique: true }),
    (0, typeorm_1.Entity)("Notifications", { schema: "dbo" })
], Notifications);
exports.Notifications = Notifications;
//# sourceMappingURL=Notifications.js.map