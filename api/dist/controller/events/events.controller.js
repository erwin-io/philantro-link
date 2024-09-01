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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_response_constant_1 = require("../../common/constant/api-response.constant");
const events_create_dto_1 = require("../../core/dto/events/events.create.dto");
const events_update_dto_1 = require("../../core/dto/events/events.update.dto");
const pagination_params_dto_1 = require("../../core/dto/pagination-params.dto");
const events_service_1 = require("../../services/events.service");
const path_1 = require("path");
let EventsController = class EventsController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async getDetails(eventCode, currentUserCode) {
        const res = {};
        try {
            res.data = await this.eventService.getByCode(eventCode, currentUserCode);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async getEventThumbnail(eventCode, res) {
        const file = await this.eventService.getEventThumbnailFile(eventCode);
        if (file) {
            const extName = (0, path_1.extname)(file.fileName);
            const filePath = `events/${eventCode}/${file.guid}${extName}`;
            const fileContent = await this.eventService.getEventThumbnailContent(filePath);
            res.set({
                "Content-Type": `img/${extName.split(".")[1]}`,
                "Content-Disposition": `attachment; filename="${file.fileName}"`,
            });
            res.send(fileContent);
        }
        else {
            res.send(null);
        }
    }
    async getPaginated(params) {
        const res = {};
        try {
            res.data = await this.eventService.getPagination(params);
            res.success = true;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async createCharityVolunteerEvent(dto) {
        const res = {};
        try {
            res.data = await this.eventService.createCharityVolunteerEvent(dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async createDonationEvent(dto) {
        const res = {};
        try {
            res.data = await this.eventService.createDonationEvent(dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async createAssistanceEvent(dto) {
        const res = {};
        try {
            res.data = await this.eventService.createAssistanceEvent(dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.SAVING_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateCharityVolunteerEvent(eventCode, dto) {
        const res = {};
        try {
            res.data = await this.eventService.updateCharityVolunteerEvent(eventCode, dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateDonationEvent(eventCode, dto) {
        const res = {};
        try {
            res.data = await this.eventService.updateDonationEvent(eventCode, dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateAssistanceEvent(eventCode, dto) {
        const res = {};
        try {
            res.data = await this.eventService.updateAssistanceEvent(eventCode, dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateStatus(eventCode, dto) {
        const res = {};
        try {
            res.data = await this.eventService.updateStatus(eventCode, dto);
            res.success = true;
            res.message = `Event status ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateEventInterested(eventCode, dto) {
        const res = {};
        try {
            res.data = await this.eventService.updateEventInterested(eventCode, dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.UPDATE_SUCCESS}`;
            return res;
        }
        catch (e) {
            res.success = false;
            res.message = e.message !== undefined ? e.message : e;
            return res;
        }
    }
    async updateEventResponded(eventCode, dto) {
        const res = {};
        try {
            res.data = await this.eventService.updateEventResponded(eventCode, dto);
            res.success = true;
            res.message = `Event ${api_response_constant_1.UPDATE_SUCCESS}`;
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
    (0, common_1.Get)("/:eventCode"),
    (0, swagger_1.ApiQuery)({
        name: "currentUserCode",
        required: false,
        description: "Current User code",
    }),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Query)("currentUserCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Get)("thumbnail/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEventThumbnail", null);
__decorate([
    (0, common_1.Post)("/page"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_params_dto_1.PaginationParamsDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getPaginated", null);
__decorate([
    (0, common_1.Post)("createCharityVolunteerEvent"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_create_dto_1.CreateCharityVolunteerEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createCharityVolunteerEvent", null);
__decorate([
    (0, common_1.Post)("createDonationEvent"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_create_dto_1.CreateDonationEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createDonationEvent", null);
__decorate([
    (0, common_1.Post)("createAssistanceEvent"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [events_create_dto_1.CreateAssistanceEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createAssistanceEvent", null);
__decorate([
    (0, common_1.Put)("/updateCharityVolunteerEvent/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, events_update_dto_1.UpdateCharityVolunteerEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateCharityVolunteerEvent", null);
__decorate([
    (0, common_1.Put)("/updateDonationEvent/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, events_update_dto_1.UpdateDonationEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateDonationEvent", null);
__decorate([
    (0, common_1.Put)("/updateAssistanceEvent/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, events_update_dto_1.UpdateAssistanceEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateAssistanceEvent", null);
__decorate([
    (0, common_1.Put)("/updateStatus/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, events_update_dto_1.UpdateEventStatusDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)("/updateEventInterested/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, events_update_dto_1.UpdateEventInterestedDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEventInterested", null);
__decorate([
    (0, common_1.Put)("/updateEventResponded/:eventCode"),
    __param(0, (0, common_1.Param)("eventCode")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, events_update_dto_1.UpdateEventRespondedDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEventResponded", null);
EventsController = __decorate([
    (0, swagger_1.ApiTags)("events"),
    (0, common_1.Controller)("events"),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
exports.EventsController = EventsController;
//# sourceMappingURL=events.controller.js.map