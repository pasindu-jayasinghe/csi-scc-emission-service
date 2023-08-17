import { PartialType } from '@nestjs/mapped-types';
import { CreateSolidBiomassDto } from './create-solid-biomass.dto';

export class UpdateSolidBiomassDto extends PartialType(CreateSolidBiomassDto) {}
