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
exports.UploadCertificateTemplateDto = exports.UpdateSystemConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSystemConfigDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Key of the system config",
        default: "key"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSystemConfigDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Value of the system config",
        default: "value"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateSystemConfigDto.prototype, "value", void 0);
exports.UpdateSystemConfigDto = UpdateSystemConfigDto;
class UploadCertificateTemplateDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UploadCertificateTemplateDto.prototype, "fileName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UploadCertificateTemplateDto.prototype, "base64", void 0);
exports.UploadCertificateTemplateDto = UploadCertificateTemplateDto;
//# sourceMappingURL=system-config.dto.js.map