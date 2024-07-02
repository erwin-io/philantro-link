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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventStatusDto = exports.UpdateEventRespondedDto = exports.UpdateEventInterestedDto = exports.UpdateAssistanceEventDto = exports.UpdateDonationEventDto = exports.UpdateCharityVolunteerEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const events_base_dto_1 = require("./events-base.dto");
const moment_1 = __importDefault(require("moment"));
const class_transformer_1 = require("class-transformer");
class UpdateCharityVolunteerEventDto extends events_base_dto_1.DefaultEventDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        default: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
    }),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Date time is required!",
    }),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
        message: "Date time must be in the format YYYY-MM-DD HH:mm:ss",
    }),
    (0, class_validator_1.IsDateString)({ strict: true }),
    __metadata("design:type", Object)
], UpdateCharityVolunteerEventDto.prototype, "dateTime", void 0);
exports.UpdateCharityVolunteerEventDto = UpdateCharityVolunteerEventDto;
class UpdateDonationEventDto extends events_base_dto_1.DefaultEventDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Transfer Type is required!"
    }),
    __metadata("design:type", String)
], UpdateDonationEventDto.prototype, "transferType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Transfer Account Number is required!"
    }),
    __metadata("design:type", String)
], UpdateDonationEventDto.prototype, "transferAccountNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Transfer Account Name is required!"
    }),
    __metadata("design:type", String)
], UpdateDonationEventDto.prototype, "transferAccountName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, Donation target amount is required!"
    }),
    (0, class_validator_1.IsNumberString)({
        message: "Not allowed, Donation target amount should be number!"
    }),
    (0, class_transformer_1.Transform)(({ obj, key }) => {
        return obj[key].toString();
    }),
    __metadata("design:type", String)
], UpdateDonationEventDto.prototype, "donationTargetAmount", void 0);
exports.UpdateDonationEventDto = UpdateDonationEventDto;
class UpdateAssistanceEventDto extends events_base_dto_1.DefaultEventDto {
}
exports.UpdateAssistanceEventDto = UpdateAssistanceEventDto;
class UpdateEventInterestedDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, User code is required!",
    }),
    __metadata("design:type", String)
], UpdateEventInterestedDto.prototype, "userCode", void 0);
exports.UpdateEventInterestedDto = UpdateEventInterestedDto;
class UpdateEventRespondedDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)({
        message: "Not allowed, User code is required!",
    }),
    __metadata("design:type", String)
], UpdateEventRespondedDto.prototype, "userCode", void 0);
exports.UpdateEventRespondedDto = UpdateEventRespondedDto;
class UpdateEventStatusDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(["APPROVED", "REJECTED", "COMPLETED", "INPROGRESS", "CANCELLED"]),
    (0, class_validator_1.IsUppercase)(),
    __metadata("design:type", String)
], UpdateEventStatusDto.prototype, "status", void 0);
exports.UpdateEventStatusDto = UpdateEventStatusDto;
//# sourceMappingURL=events.update.dto.js.map