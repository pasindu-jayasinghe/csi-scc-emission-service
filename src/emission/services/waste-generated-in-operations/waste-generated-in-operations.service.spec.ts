import { Test, TestingModule } from '@nestjs/testing';
import { WasteGeneratedInOperationsService } from './waste-generated-in-operations.service';

describe('PassengerRoadService', () => {
  let service: WasteGeneratedInOperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WasteGeneratedInOperationsService],
    }).compile();

    service = module.get<WasteGeneratedInOperationsService>(WasteGeneratedInOperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
