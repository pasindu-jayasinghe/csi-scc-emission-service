import { Test, TestingModule } from '@nestjs/testing';
import { CookingService } from './cooking.service';

describe('LpGasService', () => {
  let service: CookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookingService],
    }).compile();

    service = module.get<CookingService>(CookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
