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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = exports.ClientHelpFeedDto = exports.ClientEventFeedDto = exports.EventsByGeoDto = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dashboard_service_1 = require("../../services/dashboard.service");
class EventsByGeoDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["ALL", "PENDING", "REGISTERED"]),
    __metadata("design:type", String)
], EventsByGeoDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EventsByGeoDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EventsByGeoDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], EventsByGeoDto.prototype, "radius", void 0);
exports.EventsByGeoDto = EventsByGeoDto;
class ClientEventFeedDto {
    constructor() {
        this.latitude = 0;
        this.longitude = 0;
        this.radius = 0;
        this.skip = 0;
        this.limit = 10;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientEventFeedDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientEventFeedDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientEventFeedDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: String,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, eventType is required!",
    }),
    __metadata("design:type", Array)
], ClientEventFeedDto.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientEventFeedDto.prototype, "skip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientEventFeedDto.prototype, "limit", void 0);
exports.ClientEventFeedDto = ClientEventFeedDto;
class ClientHelpFeedDto {
    constructor() {
        this.latitude = 0;
        this.longitude = 0;
        this.radius = 0;
        this.skip = 0;
        this.limit = 10;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientHelpFeedDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientHelpFeedDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientHelpFeedDto.prototype, "radius", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
        type: String,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, helpType is required!",
    }),
    __metadata("design:type", Array)
], ClientHelpFeedDto.prototype, "helpType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientHelpFeedDto.prototype, "skip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], ClientHelpFeedDto.prototype, "limit", void 0);
exports.ClientHelpFeedDto = ClientHelpFeedDto;
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getDashboardUsers() {
        const res = {};
        try {
            res.data = await this.dashboardService.getDashboardSummary();
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getEventsByGeo(params) {
        const res = {};
        try {
            res.data = await this.dashboardService.getEventsByGeo(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getClientEventFeed(params) {
        const res = {};
        try {
            res.data = await this.dashboardService.getClientEventFeed(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getClientHelpFeed(params) {
        const res = {};
        try {
            res.data = await this.dashboardService.getClientHelpFeed(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
};
__decorate([
    (0, common_1.Get)("/getDashboardSummary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboardUsers", null);
__decorate([
    (0, common_1.Post)("/getEventsByGeo"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EventsByGeoDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getEventsByGeo", null);
__decorate([
    (0, common_1.Post)("/getClientEventFeed"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClientEventFeedDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientEventFeed", null);
__decorate([
    (0, common_1.Post)("/getClientHelpFeed"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ClientHelpFeedDto]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getClientHelpFeed", null);
DashboardController = __decorate([
    (0, common_1.Controller)("dashboard"),
    (0, swagger_1.ApiTags)("dashboard"),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map