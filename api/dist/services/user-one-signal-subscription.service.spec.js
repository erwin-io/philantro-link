"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_one_signal_subscription_service_1 = require("./user-one-signal-subscription.service");
describe("UserOneSignalSubscriptionService", () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [user_one_signal_subscription_service_1.UserOneSignalSubscriptionService],
        }).compile();
        service = module.get(user_one_signal_subscription_service_1.UserOneSignalSubscriptionService);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=user-one-signal-subscription.service.spec.js.map