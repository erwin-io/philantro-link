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
exports.UserProfilePic = void 0;
const typeorm_1 = require("typeorm");
const Files_1 = require("./Files");
const Users_1 = require("./Users");
let UserProfilePic = class UserProfilePic {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "UserId" }),
    __metadata("design:type", String)
], UserProfilePic.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.userProfilePics),
    (0, typeorm_1.JoinColumn)([{ name: "FileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], UserProfilePic.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Users_1.Users, (users) => users.userProfilePic),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], UserProfilePic.prototype, "user", void 0);
UserProfilePic = __decorate([
    (0, typeorm_1.Index)("pk_userprofilepic_1_1525580473", ["userId"], { unique: true }),
    (0, typeorm_1.Entity)("UserProfilePic", { schema: "dbo" })
], UserProfilePic);
exports.UserProfilePic = UserProfilePic;
//# sourceMappingURL=UserProfilePic.js.map