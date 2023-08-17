import { Injectable } from '@nestjs/common';
import { CreateSolidBiomassDto } from './dto/create-solid-biomass.dto';
import { UpdateSolidBiomassDto } from './dto/update-solid-biomass.dto';

@Injectable()
export class SolidBiomassService {
  create(createSolidBiomassDto: CreateSolidBiomassDto) {
    return 'This action adds a new solidBiomass';
  }


  findAll() {
    return `This action returns all solidBiomass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solidBiomass`;
  }

  update(id: number, updateSolidBiomassDto: UpdateSolidBiomassDto) {
    return `This action updates a #${id} solidBiomass`;
  }
  // update(id: number, updateSolidBiomassDto: UpdateSolidBiomassDto) {
  //   return `This action updates a #${id} solidBiomass`;
  // }

  remove(id: number) {
    return `This action removes a #${id} solidBiomass`;
  }
}
