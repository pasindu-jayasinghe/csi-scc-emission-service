import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BiologicalTreatmentSolidWaste } from './biologicalTreatmentSolidWaste.entity';
import { Fuel } from './fuel.entity';

@Injectable()
export class BiologicalTreatmentSolidWasteService extends TypeOrmCrudService<BiologicalTreatmentSolidWaste>{

  constructor(@InjectRepository(BiologicalTreatmentSolidWaste) repo,) { super(repo) };

  async create(createFuelDto: BiologicalTreatmentSolidWaste) {

    console.log(createFuelDto)
    return await this.repo.save(createFuelDto);
  }

  public async getBiologicalTreatmentFactors(gasType: string, wasteBasis: string, biologicalTreatmentSystem: string,
    wasteCategory: string, typeOfWaste: string, tier: string, countryCode: string): Promise<any> {

      let filter: string = "fac.name = :gasType AND fac.wasteBasis = :wasteBasis AND fac.biologicalTreatmentSystem = :biologicalTreatmentSystem AND fac.wasteCategory = :wasteCategory AND fac.typeOfWaste = :typeOfWaste AND fac.tier = :tier AND fac.countryCode = :countryCode";

    const data = this.repo.createQueryBuilder("fac")
      .where(filter,
        { gasType: gasType, wasteBasis: wasteBasis, biologicalTreatmentSystem: biologicalTreatmentSystem, tier: tier, countryCode: countryCode, wasteCategory: wasteCategory, typeOfWaste: typeOfWaste })

    let factor = await data.getMany()

    console.log(data.getQuery())

    let res = {};
    res = factor;

    if (res === -1) {
      console.log("---------------start getBiologicalTreatmentFactors------------------")
      console.log(countryCode, tier);
      console.log("getBiologicalTreatmentFactors --- ", res);
      console.log("----------------end getBiologicalTreatmentFactors-----------------")
    }
    return res;

  }


}
