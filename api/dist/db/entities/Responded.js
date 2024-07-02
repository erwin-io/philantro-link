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
exports.Responded = void 0;
const typeorm_1 = require("typeorm");
const Events_1 = require("./Events");
const Users_1 = require("./Users");
let Responded = class Responded {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "UserId" }),
    __metadata("design:type", String)
], Responded.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Events_1.Events, (events) => events.respondeds),
    (0, typeorm_1.JoinColumn)([{ name: "EventId", referencedColumnName: "eventId" }]),
    __metadata("design:type", Events_1.Events)
], Responded.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Users_1.Users, (users) => users.responded),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], Responded.prototype, "user", void 0);
Responded = __decorate([
    (0, typeorm_1.Index)("Responded_pkey", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("Responded", { schema: "dbo" })
], Responded);
exports.Responded = Responded;
//# sourceMappingURL=Responded.js.map