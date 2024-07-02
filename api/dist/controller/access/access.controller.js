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
exports.AccessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const access_create_dto_1 = require("../../core/dto/access/access.create.dto");
const access_update_dto_1 = require("../../core/dto/access/access.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const access_service_1 = require("../../services/access.service");
let AccessController = class AccessController {
    constructor(accessService) {
        this.accessService = accessService;
    }
    async getDetails(accessCode) {
        const res = {};
        try {
            res.data = await this.accessService.getByCode(accessCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.accessService.getAccessPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async create(accessDto) {
        const res = {};
        try {
            res.data = await this.accessService.create(accessDto);
            res.success = true;
            res.message = `User group ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async update(accessCode, dto) {
        const res = {};
        try {
            res.data = await this.accessService.update(accessCode, dto);
            res.success = true;
            res.message = `User group ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async delete(accessCode) {
        const res = {};
        try {
            res.data = await this.accessService.delete(accessCode);
            res.success = true;
            res.message = `User group ${api_response_constant_1.DELETE_SUCCESS}`;
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
    (0, common_1.Get)("/:accessCode"),
    __param(0, (0, common_1.Param)("accessCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)(""),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [access_create_dto_1.CreateAccessDto]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("/:accessCode"),
    __param(0, (0, common_1.Param)("accessCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, access_update_dto_1.UpdateAccessDto]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)("/:accessCode"),
    __param(0, (0, common_1.Param)("accessCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessController.prototype, "delete", null);
AccessController = __decorate([
    (0, swagger_1.ApiTags)("access"),
    (0, common_1.Controller)("access"),
    __metadata("design:paramtypes", [access_service_1.AccessService])
], AccessController);
exports.AccessController = AccessController;
//# sourceMappingURL=access.controller.js.map