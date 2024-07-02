"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const one_signal_notification_service_1 = require("./one-signal-notification.service");
describe('OneSignalNotificationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [one_signal_notification_service_1.OneSignalNotificationService],
        }).compile();
        service = module.get(one_signal_notification_service_1.OneSignalNotificationService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=one-signal-notification.service.spec.js.map