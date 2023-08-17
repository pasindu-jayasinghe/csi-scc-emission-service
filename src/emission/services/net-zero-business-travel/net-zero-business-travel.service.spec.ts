import { Test, TestingModule } from '@nestjs/testing';
import { NetZeroBusinessTravelService } from './net-zero-business-travel.service';

describe('PassengerRoadService', () => {
  let service: NetZeroBusinessTravelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NetZeroBusinessTravelService],
    }).compile();

    service = module.get<NetZeroBusinessTravelService>(NetZeroBusinessTravelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
