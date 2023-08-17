import { Test, TestingModule } from '@nestjs/testing';
import { GasBiomassService } from './gas-biomass.service';

describe('GasBiomassService', () => {
  let service: GasBiomassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GasBiomassService],
    }).compile();

    service = module.get<GasBiomassService>(GasBiomassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
