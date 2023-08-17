import { Test, TestingModule } from '@nestjs/testing';
import { FreightAirService } from './freight-air.service';

describe('AirDistanceBaseService', () => {
  let service: FreightAirService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreightAirService],
    }).compile();

    service = module.get<FreightAirService>(FreightAirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
