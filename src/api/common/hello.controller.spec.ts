import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';

describe('RootController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('shoud be define', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('shoud response is hello', async () => {
      const response = await controller.getHello();
      expect(response).toEqual('hello');
    });
  });
});
