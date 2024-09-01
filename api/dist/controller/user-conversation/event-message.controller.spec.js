"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const event_message_controller_1 = require("./event-message.controller");
describe("EventMessageController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [event_message_controller_1.EventMessageController],
        }).compile();
        controller = module.get(event_message_controller_1.EventMessageController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=event-message.controller.spec.js.map