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
exports.VerifyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../../services/auth.service");
const config_1 = require("@nestjs/config");
let VerifyController = class VerifyController {
    constructor(authService, config) {
        this.authService = authService;
        this.config = config;
    }
    async get(req) {
        try {
            const queryParams = req.query;
            const userCode = queryParams["user"];
            const hashOTP = queryParams["code"];
            if (!userCode || !hashOTP) {
                throw new Error("Invalid url");
            }
            const isVerified = await this.authService.verifyUser(userCode, hashOTP);
            if (isVerified) {
                return {
                    isVerified,
                    company: this.config.get("EV_COMPANY"),
                    year: new Date().getFullYear().toString(),
                    deepLink: "philantrolink://home",
                    title: "Verificaton",
                    cssFile: "/css/verify.css",
                    jsFile: "/js/verify.js",
                    layout: "layouts/main-layout",
                };
            }
            else {
                return {
                    invalidUrl: true,
                    message: "Invalid url",
                    company: this.config.get("EV_COMPANY"),
                    year: new Date().getFullYear().toString(),
                    title: "Verificaton",
                    cssFile: "/css/verify.css",
                    jsFile: "/js/verify.js",
                    layout: "layouts/main-layout",
                };
            }
        }
        catch (ex) {
            return {
                invalidUrl: true,
                exist: (ex === null || ex === void 0 ? void 0 : ex.message) && (ex === null || ex === void 0 ? void 0 : ex.message.includes("already verified")),
                message: ex === null || ex === void 0 ? void 0 : ex.message,
                company: this.config.get("EV_COMPANY"),
                year: new Date().getFullYear().toString(),
                title: "Verificaton failed",
                cssFile: "/css/verify.css",
                jsFile: "/js/verify.js",
                layout: "layouts/main-layout",
            };
        }
    }
};
__decorate([
    (0, common_1.Get)(""),
    (0, common_1.Render)("verify"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VerifyController.prototype, "get", null);
VerifyController = __decorate([
    (0, common_1.Controller)({
        path: "verify",
    }),
    (0, swagger_1.ApiExcludeController)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], VerifyController);
exports.VerifyController = VerifyController;
//# sourceMappingURL=verify.controller.js.map