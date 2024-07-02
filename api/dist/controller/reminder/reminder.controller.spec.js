"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const reminder_controller_1 = require("./reminder.controller");
describe("ReminderController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [reminder_controller_1.ReminderController],
        }).compile();
        controller = module.get(reminder_controller_1.ReminderController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=reminder.controller.spec.js.map