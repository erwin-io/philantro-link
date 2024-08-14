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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepLinkController = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const config_1 = require("@nestjs/config");
let DeepLinkController = class DeepLinkController {
    constructor(config) {
        this.config = config;
    }
    async getJsonFile(res) {
        const jsonPath = "../../assets/assetlinks.json";
        const fileStream = (0, fs_1.createReadStream)(path_1.default.join(__dirname, jsonPath));
        fileStream.pipe(res);
    }
};
__decorate([
    (0, common_1.Get)("assetlinks.json"),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeepLinkController.prototype, "getJsonFile", null);
DeepLinkController = __decorate([
    (0, common_1.Controller)(".well-known"),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DeepLinkController);
exports.DeepLinkController = DeepLinkController;
//# sourceMappingURL=deep-link.controller.js.map