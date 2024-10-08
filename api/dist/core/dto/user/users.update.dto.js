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
exports.UpdateClientUserProfileDto = exports.UpdateUserProfileDto = exports.UpdateAdminUserDto = exports.UpdateClientUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_base_dto_1 = require("./user-base.dto");
class UpdateClientUserDto extends user_base_dto_1.DefaultUserDto {
}
exports.UpdateClientUserDto = UpdateClientUserDto;
class UpdateAdminUserDto extends user_base_dto_1.DefaultUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    __metadata("design:type", String)
], UpdateAdminUserDto.prototype, "accessCode", void 0);
exports.UpdateAdminUserDto = UpdateAdminUserDto;
class UpdateUserProfileDto extends user_base_dto_1.DefaultUserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateUserProfileDto.prototype, "userProfilePic", void 0);
exports.UpdateUserProfileDto = UpdateUserProfileDto;
class UpdateClientUserProfileDto extends user_base_dto_1.DefaultUserDto {
    constructor() {
        super(...arguments);
        this.helpNotifPreferences = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateClientUserProfileDto.prototype, "userProfilePic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Help/Assistance types",
        example: [],
        isArray: true,
        enum: ["WATER", "FOOD", "CLOTHING", "SERVICES"],
        default: []
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsIn)(["WATER", "FOOD", "CLOTHING", "SERVICES"], { each: true }),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Help Notif Preferences is required!",
    }),
    __metadata("design:type", Array)
], UpdateClientUserProfileDto.prototype, "helpNotifPreferences", void 0);
exports.UpdateClientUserProfileDto = UpdateClientUserProfileDto;
//# sourceMappingURL=users.update.dto.js.map