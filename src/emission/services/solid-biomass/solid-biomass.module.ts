import { Module } from '@nestjs/common';
import { SolidBiomassService } from './solid-biomass.service';
import { SolidBiomassController } from './solid-biomass.controller';

@Module({
  controllers: [SolidBiomassController],
  providers: [SolidBiomassService]
})
export class SolidBiomassModule {}
