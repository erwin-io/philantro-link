"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const events_controller_1 = require("./events.controller");
describe("EventsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [events_controller_1.EventsController],
        }).compile();
        controller = module.get(events_controller_1.EventsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=events.controller.spec.js.map