"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyModule = void 0;
const common_1 = require("@nestjs/common");
const verify_controller_1 = require("./verify.controller");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const firebase_provider_module_1 = require("../../core/provider/firebase/firebase-provider.module");
const auth_service_1 = require("../../services/auth.service");
const Users_1 = require("../../db/entities/Users");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const notifications_module_1 = require("../notifications/notifications.module");
const users_module_1 = require("../users/users.module");
const email_service_1 = require("../../services/email.service");
let VerifyModule = class VerifyModule {
};
VerifyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            firebase_provider_module_1.FirebaseProviderModule,
            axios_1.HttpModule,
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
            passport_1.PassportModule.register({}),
            jwt_1.JwtModule.register({}),
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users]),
        ],
        controllers: [verify_controller_1.VerifyController],
        providers: [auth_service_1.AuthService, email_service_1.EmailService],
    })
], VerifyModule);
exports.VerifyModule = VerifyModule;
//# sourceMappingURL=verify.module.js.map