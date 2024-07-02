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
exports.EventImage = void 0;
const typeorm_1 = require("typeorm");
const Events_1 = require("./Events");
const Files_1 = require("./Files");
const Users_1 = require("./Users");
let EventImage = class EventImage {
};
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "EventId" }),
    __metadata("design:type", String)
], EventImage.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", { primary: true, name: "FileId" }),
    __metadata("design:type", String)
], EventImage.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)("boolean", { name: "Active", default: () => "true" }),
    __metadata("design:type", Boolean)
], EventImage.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Events_1.Events, (events) => events.eventImages),
    (0, typeorm_1.JoinColumn)([{ name: "EventId", referencedColumnName: "eventId" }]),
    __metadata("design:type", Events_1.Events)
], EventImage.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Files_1.Files, (files) => files.eventImages),
    (0, typeorm_1.JoinColumn)([{ name: "FileId", referencedColumnName: "fileId" }]),
    __metadata("design:type", Files_1.Files)
], EventImage.prototype, "file", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.eventImages),
    (0, typeorm_1.JoinColumn)([{ name: "UserId", referencedColumnName: "userId" }]),
    __metadata("design:type", Users_1.Users)
], EventImage.prototype, "user", void 0);
EventImage = __decorate([
    (0, typeorm_1.Index)("EventImage_pkey", ["eventId", "fileId"], { unique: true }),
    (0, typeorm_1.Entity)("EventImage", { schema: "dbo" })
], EventImage);
exports.EventImage = EventImage;
//# sourceMappingURL=EventImage.js.map