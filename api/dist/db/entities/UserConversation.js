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
exports.UserConversation = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let UserConversation = class UserConversation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "UserConversationId" }),
    __metadata("design:type", String)
], UserConversation.prototype, "userConversationId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Title" }),
    __metadata("design:type", String)
], UserConversation.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Description" }),
    __metadata("design:type", String)
], UserConversation.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], UserConversation.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Type" }),
    __metadata("design:type", String)
], UserConversation.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "ReferenceId" }),
    __metadata("design:type", String)
], UserConversation.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Status", default: () => "'SENT'" }),
    __metadata("design:type", String)
], UserConversation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.userConversations),
    (0, typeorm_1.JoinColumn)([{ name: "FromUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], UserConversation.prototype, "fromUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.userConversations2),
    (0, typeorm_1.JoinColumn)([{ name: "ToUserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], UserConversation.prototype, "toUser", void 0);
UserConversation = __decorate([
    (0, typeorm_1.Index)("UserConversation_pkey", ["userConversationId"], { unique: true }),
    (0, typeorm_1.Entity)("UserConversation", { schema: "dbo" })
], UserConversation);
exports.UserConversation = UserConversation;
//# sourceMappingURL=UserConversation.js.map