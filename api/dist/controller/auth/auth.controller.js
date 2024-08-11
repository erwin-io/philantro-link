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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../services/auth.service");
const login_dto_1 = require("../../core/dto/auth/login.dto");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const register_dto_1 = require("../../core/dto/auth/register.dto");
const verify_dto_1 = require("../../core/dto/auth/verify.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerClient(createUserDto) {
        const res = {};
        try {
            res.data = await this.authService.registerClient(createUserDto);
            res.success = true;
            res.message = `${api_response_constant_1.REGISTER_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async verifyClient(dto) {
        const res = {};
        try {
            res.data = await this.authService.verifyClient(dto);
            res.success = true;
            res.message = `${api_response_constant_1.VERIFICATION_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async loginAdmin(loginUserDto) {
        const res = {};
        try {
            res.data = await this.authService.getAdminByCredentials(loginUserDto);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async loginClient(loginUserDto) {
        const res = {};
        try {
            res.data = await this.authService.getClientByCredentials(loginUserDto);
            res.success = true;
            return res;
        }
        catch (e) {
            throw new common_1.HttpException(e.message !== undefined ? e.message : e, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
__decorate([
    (0, common_1.Post)("register/client"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterClientUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerClient", null);
__decorate([
    (0, common_1.Post)("verifyClient/client"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_dto_1.VerifyClientUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyClient", null);
__decorate([
    (0, common_1.Post)("login/admin"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LogInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Post)("login/client"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LogInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginClient", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map