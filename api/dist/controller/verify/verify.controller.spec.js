"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const verify_controller_1 = require("./verify.controller");
describe("VerifyController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [verify_controller_1.VerifyController],
        }).compile();
        controller = module.get(verify_controller_1.VerifyController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=verify.controller.spec.js.map