"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const message_service_1 = require("./message.service");
describe('MessageService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [message_service_1.MessageService],
        }).compile();
        service = module.get(message_service_1.MessageService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=message.service.spec.js.map