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
exports.UserOneSignalSubscription = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let UserOneSignalSubscription = class UserOneSignalSubscription {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "UserId" }),
    __metadata("design:type", String)
], UserOneSignalSubscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { primary: true, name: "SubscriptionID" }),
    __metadata("design:type", String)
], UserOneSignalSubscription.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.userOneSignalSubscriptions),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], UserOneSignalSubscription.prototype, "user", void 0);
UserOneSignalSubscription = __decorate([
    (0, typeorm_1.Index)("UserOneSignalSubscription_pkey", ["subscriptionId", "userId"], {
        unique: true,
    }),
    (0, typeorm_1.Entity)("UserOneSignalSubscription", { schema: "dbo" })
], UserOneSignalSubscription);
exports.UserOneSignalSubscription = UserOneSignalSubscription;
//# sourceMappingURL=UserOneSignalSubscription.js.map