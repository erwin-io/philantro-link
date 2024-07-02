"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const support_ticket_service_1 = require("./support-ticket.service");
describe("SupportTicketService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [support_ticket_service_1.SupportTicketService],
        }).compile();
        service = module.get(support_ticket_service_1.SupportTicketService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=support-ticket.service.spec.js.map