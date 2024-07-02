import { Test, TestingModule } from "@nestjs/testing";
import { PaymentDoneController } from "./payment-done.controller";

describe("PaymentDoneController", () => {
  let controller: PaymentDoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentDoneController],
    }).compile();

    controller = module.get<PaymentDoneController>(PaymentDoneController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
