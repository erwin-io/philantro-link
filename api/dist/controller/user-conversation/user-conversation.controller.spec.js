"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_conversation_controller_1 = require("./user-conversation.controller");
describe("UserConversationController", () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_conversation_controller_1.UserConversationController],
        }).compile();
        controller = module.get(user_conversation_controller_1.UserConversationController);
    });
    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=user-conversation.controller.spec.js.map