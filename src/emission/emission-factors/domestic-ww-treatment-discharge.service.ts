import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BiologicalTreatmentSolidWaste } from './biologicalTreatmentSolidWaste.entity';
import { DomesticWWTreatmentDischarge } from './domestic-ww-treatment-discharge.entity';
import { Fuel } from './fuel.entity';

@Injectable()
export class DomesticWWTreatmentDischargeService extends TypeOrmCrudService<DomesticWWTreatmentDischarge>{

  constructor(@InjectRepository(DomesticWWTreatmentDischarge) repo,) { super(repo) };

  async create(createFuelDto: DomesticWWTreatmentDischarge) {

    console.log(createFuelDto)
    return await this.repo.save(createFuelDto);
  }

  public async getDomesticWasteWaterFactors(treatmentDischargeType: string, tier: string): Promise<any> {

      let filter: string = "fac.treatmentDischargeType = :treatmentDischargeType AND fac.tier = :tier";

    const data = this.repo.createQueryBuilder("fac")
      .where(filter,
        { treatmentDischargeType: treatmentDischargeType, tier: tier })

    let factor = await data.getMany()

    let res = {};
    res = factor;

    if (res === -1) {
      console.log("---------------start getDomesticWasteWaterFactors------------------")
      console.log(treatmentDischargeType, tier);
      console.log("getDomesticWasteWaterFactors --- ", res);
      console.log("----------------end getDomesticWasteWaterFactors-----------------")
    }
    return res;

  }

}
