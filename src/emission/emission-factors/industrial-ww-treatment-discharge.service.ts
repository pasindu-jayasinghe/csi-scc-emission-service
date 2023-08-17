import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Fuel } from './fuel.entity';
import { IndustrialWWTreatmentDischarge } from './industrial-ww-treatment-discharge.entity';
import { WasteIncineration } from './waste-incineration.entity';

@Injectable()
export class IndustrialWWTreatmentDischargeService extends TypeOrmCrudService<IndustrialWWTreatmentDischarge>{

  constructor(@InjectRepository(IndustrialWWTreatmentDischarge) repo,) { super(repo) };

  async create(createFuelDto: IndustrialWWTreatmentDischarge) {

    console.log(createFuelDto)
    return await this.repo.save(createFuelDto);
  }

  public async getIndustrialWasteWaterFactors(treatmentDischargeType: string, tier: string): Promise<any> {

    let filter: string = "fac.treatmentDischargeType = :treatmentDischargeType AND fac.tier = :tier";

  const data = this.repo.createQueryBuilder("fac")
    .where(filter,
      { treatmentDischargeType: treatmentDischargeType, tier: tier })

  let factor = await data.getMany()

  let res = {};
  res = factor;

  if (res === -1) {
    console.log("---------------start getIndustrialWasteWaterFactors------------------")
    console.log(treatmentDischargeType, tier);
    console.log("getIndustrialWasteWaterFactors --- ", res);
    console.log("----------------end getIndustrialWasteWaterFactors-----------------")
  }
  return res;

}

}
