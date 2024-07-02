"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const notifications_controller_1 = require("./notifications.controller");
describe("NotificationsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [notifications_controller_1.NotificationsController],
        }).compile();
        controller = module.get(notifications_controller_1.NotificationsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=notifications.controller.spec.js.map