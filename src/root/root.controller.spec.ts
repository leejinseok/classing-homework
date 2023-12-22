import { Test, TestingModule } from '@nestjs/testing';
import { RootController } from './root.controller';

describe('RootController', () => {
  let controller: RootController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
    }).compile();

    controller = module.get<RootController>(RootController);
  });

  it('shoud be define', () => {
    expect(controller).toBeDefined();
  });

  describe('getRoot', () => {
    it('shoud response is hello', async () => {
      const response = await controller.getHello();
      expect(response).toEqual('hello');
    });
  });
});
