import { Test, TestingModule } from '@nestjs/testing';
import { UnitConversionController } from './unit-conversion.controller';
import { UnitConversionService } from './unit-conversion.service';

describe('UnitConversionController', () => {
  let controller: UnitConversionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitConversionController],
      providers: [UnitConversionService],
    }).compile();

    controller = module.get<UnitConversionController>(UnitConversionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
