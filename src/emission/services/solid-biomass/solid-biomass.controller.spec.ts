import { Test, TestingModule } from '@nestjs/testing';
import { SolidBiomassController } from './solid-biomass.controller';
import { SolidBiomassService } from './solid-biomass.service';

describe('SolidBiomassController', () => {
  let controller: SolidBiomassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolidBiomassController],
      providers: [SolidBiomassService],
    }).compile();

    controller = module.get<SolidBiomassController>(SolidBiomassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
