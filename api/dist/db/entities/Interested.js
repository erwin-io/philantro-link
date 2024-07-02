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
exports.Interested = void 0;
const typeorm_1 = require("typeorm");
const Events_1 = require("./Events");
const Users_1 = require("./Users");
let Interested = class Interested {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "UserId" }),
    __metadata("design:type", String)
], Interested.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Events_1.Events, (events) => events.interesteds),
    (0, typeorm_1.JoinColumn)([{ name: "EventId", referencedColumnName: "eventId" }]),
    __metadata("design:type", Events_1.Events)
], Interested.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Users_1.Users, (users) => users.interested),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], Interested.prototype, "user", void 0);
Interested = __decorate([
    (0, typeorm_1.Index)("Ratings_pkey", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("Interested", { schema: "dbo" })
], Interested);
exports.Interested = Interested;
//# sourceMappingURL=Interested.js.map