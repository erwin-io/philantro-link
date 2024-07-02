"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payment_done_controller_1 = require("./payment-done.controller");
describe("PaymentDoneController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [payment_done_controller_1.PaymentDoneController],
        }).compile();
        controller = module.get(payment_done_controller_1.PaymentDoneController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=payment-done.controller.spec.js.map