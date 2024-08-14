import { Test, TestingModule } from '@nestjs/testing';
import { DeepLinkController } from './deep-link.controller';

describe('DeepLinkController', () => {
  let controller: DeepLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeepLinkController],
    }).compile();

    controller = module.get<DeepLinkController>(DeepLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
