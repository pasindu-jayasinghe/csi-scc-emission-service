import { Test, TestingModule } from '@nestjs/testing';
import { SolidBiomassService } from './solid-biomass.service';

describe('SolidBiomassService', () => {
  let service: SolidBiomassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolidBiomassService],
    }).compile();

    service = module.get<SolidBiomassService>(SolidBiomassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
