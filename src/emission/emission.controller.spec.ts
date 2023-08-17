import { Test, TestingModule } from '@nestjs/testing';
import { EmissionController } from './emission.controller';

describe('EmissionController', () => {
  let controller: EmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmissionController],
    }).compile();

    controller = module.get<EmissionController>(EmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
