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
exports.DefaultEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const map_dto_1 = require("../map/map.dto");
class DefaultEventDto {
    constructor() {
        this.eventImages = [];
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Event name is required!"
    }),
    __metadata("design:type", String)
], DefaultEventDto.prototype, "eventName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Event description is required!"
    }),
    __metadata("design:type", String)
], DefaultEventDto.prototype, "eventDesc", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Event locations is required!"
    }),
    __metadata("design:type", String)
], DefaultEventDto.prototype, "eventLocName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: false,
        required: true,
        type: map_dto_1.MapDto
    }),
    (0, class_validator_1.IsNotEmptyObject)(),
    (0, class_transformer_1.Type)(() => map_dto_1.MapDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", map_dto_1.MapDto)
], DefaultEventDto.prototype, "eventLocMap", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        isArray: true,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], DefaultEventDto.prototype, "eventImages", void 0);
exports.DefaultEventDto = DefaultEventDto;
//# sourceMappingURL=events-base.dto.js.map