"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const event_message_service_1 = require("./event-message.service");
describe("EventMessageService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [event_message_service_1.EventMessageService],
        }).compile();
        service = module.get(event_message_service_1.EventMessageService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=user-conversation.service.spec.js.map