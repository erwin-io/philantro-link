"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessModule = void 0;
const common_1 = require("@nestjs/common");
const access_controller_1 = require("./access.controller");
const Access_1 = require("../../db/entities/Access");
const access_service_1 = require("../../services/access.service");
const typeorm_1 = require("@nestjs/typeorm");
let AccessModule = class AccessModule {
};
AccessModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Access_1.Access])],
        controllers: [access_controller_1.AccessController],
        providers: [access_service_1.AccessService],
        exports: [access_service_1.AccessService],
    })
], AccessModule);
exports.AccessModule = AccessModule;
//# sourceMappingURL=access.module.js.map