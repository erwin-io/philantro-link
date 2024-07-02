"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reminder_service_1 = require("./reminder.service");
describe("ReminderService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [reminder_service_1.ReminderService],
        }).compile();
        service = module.get(reminder_service_1.ReminderService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=reminder.service.spec.js.map