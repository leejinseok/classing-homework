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

  it('주입확인', () => {
    expect(controller).toBeDefined();
  });

  it('hello 테스트', async () => {
    const response = await controller.getHello();
    expect(response).toEqual('hello');
  });
});
