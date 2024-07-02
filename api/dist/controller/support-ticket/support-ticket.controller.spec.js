"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const support_ticket_controller_1 = require("./support-ticket.controller");
describe("SupportTicketController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [support_ticket_controller_1.SupportTicketController],
        }).compile();
        controller = module.get(support_ticket_controller_1.SupportTicketController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=support-ticket.controller.spec.js.map