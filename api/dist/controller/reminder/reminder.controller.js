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
exports.ReminderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reminder_dto_1 = require("../../core/dto/reminder/reminder.dto");
const reminder_service_1 = require("../../services/reminder.service");
let ReminderController = class ReminderController {
    constructor(reminderService) {
        this.reminderService = reminderService;
    }
    async sendDueReminder(params) {
        const res = {};
        try {
            res.data = await this.reminderService.sendDueReminder(params);
            res.success = true;
            res.message = `Reminder sent!`;
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
    (0, common_1.Post)("/sendDueReminder"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reminder_dto_1.ReminderDto]),
    __metadata("design:returntype", Promise)
], ReminderController.prototype, "sendDueReminder", null);
ReminderController = __decorate([
    (0, swagger_1.ApiTags)("reminder"),
    (0, common_1.Controller)("reminder"),
    __metadata("design:paramtypes", [reminder_service_1.ReminderService])
], ReminderController);
exports.ReminderController = ReminderController;
//# sourceMappingURL=reminder.controller.js.map