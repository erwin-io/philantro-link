"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const deep_link_controller_1 = require("./deep-link.controller");
describe('DeepLinkController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [deep_link_controller_1.DeepLinkController],
        }).compile();
        controller = module.get(deep_link_controller_1.DeepLinkController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=deep-link.controller.spec.js.map