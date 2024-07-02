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
exports.Access = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let Access = class Access {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "bigint", name: "AccessId" }),
    __metadata("design:type", String)
], Access.prototype, "accessId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "Name" }),
    __metadata("design:type", String)
], Access.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { name: "AccessPages", default: [] }),
    __metadata("design:type", Object)
], Access.prototype, "accessPages", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], Access.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", { name: "AccessCode", nullable: true }),
    __metadata("design:type", String)
], Access.prototype, "accessCode", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Users_1.Users, (users) => users.access),
    __metadata("design:type", Array)
], Access.prototype, "users", void 0);
Access = __decorate([
    (0, typeorm_1.Index)("Access_pkey", ["accessId"], { unique: true }),
    (0, typeorm_1.Entity)("Access", { schema: "dbo" })
], Access);
exports.Access = Access;
//# sourceMappingURL=Access.js.map