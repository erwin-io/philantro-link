import { Test, TestingModule } from "@nestjs/testing";
import { EventMessageController } from "./event-message.controller";

describe("EventMessageController", () => {
  let controller: EventMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventMessageController],
    }).compile();

    controller = module.get<EventMessageController>(EventMessageController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
