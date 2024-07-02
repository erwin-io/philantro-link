"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const access_controller_1 = require("./access.controller");
describe("AccessController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [access_controller_1.AccessController],
        }).compile();
        controller = module.get(access_controller_1.AccessController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=access.controller.spec.js.map