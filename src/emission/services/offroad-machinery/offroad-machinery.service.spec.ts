import { Test, TestingModule } from '@nestjs/testing';
import { OffroadMachineryService } from './offroad-machinery.service';

describe('OffroadMachineryService', () => {
  let service: OffroadMachineryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffroadMachineryService],
    }).compile();

    service = module.get<OffroadMachineryService>(OffroadMachineryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
