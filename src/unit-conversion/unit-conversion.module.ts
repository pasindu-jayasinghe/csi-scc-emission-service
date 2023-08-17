import { Module } from '@nestjs/common';
import { UnitConversionService } from './unit-conversion.service';
import { UnitConversionController } from './unit-conversion.controller';
import { MasterDataService } from 'src/shared/master-data.service';

@Module({
  controllers: [UnitConversionController],
  providers: [UnitConversionService, MasterDataService],
  exports: [UnitConversionService]
})
export class UnitConversionModule {}
