"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const access_service_1 = require("./access.service");
describe("AccessService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [access_service_1.AccessService],
        }).compile();
        service = module.get(access_service_1.AccessService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=access.service.spec.js.map