"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transactions_controller_1 = require("./transactions.controller");
describe("TransactionsController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [transactions_controller_1.TransactionsController],
        }).compile();
        controller = module.get(transactions_controller_1.TransactionsController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=transactions.controller.spec.js.map