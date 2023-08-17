import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Fuel } from './fuel.entity';
import { OpenBurningOfWaste } from './open-burning-of-waste.entity';
import { WasteIncineration } from './waste-incineration.entity';

@Injectable()
export class OpenBurningOfWasteService extends TypeOrmCrudService<OpenBurningOfWaste>{

  constructor(@InjectRepository(OpenBurningOfWaste) repo,) { super(repo) };

  async create(createFuelDto: OpenBurningOfWaste) {

    console.log(createFuelDto)
    return await this.repo.save(createFuelDto);
  }

  public async getOpenBurningFactors(gasType: string, mswType: string,
    wasteCategory: string, typeOfWaste: string, tier: string, countryCode: string): Promise<any> {

      let filter: string = "fac.name = :gasType AND fac.mswType = :mswType AND fac.wasteCategory = :wasteCategory AND fac.typeOfWate = :typeOfWaste AND fac.tier = :tier AND fac.country = :countryCode";

    const data = this.repo.createQueryBuilder("fac")
      .where(filter,
        { gasType: gasType, mswType: mswType, tier: tier, countryCode: countryCode, wasteCategory: wasteCategory, typeOfWaste: typeOfWaste })

    let factor = await data.getMany()

    let res = {};
    res = factor;

    if (res === -1) {
      console.log("---------------start getOpenBurningFactors------------------")
      console.log(countryCode, tier);
      console.log("getOpenBurningFactors --- ", res);
      console.log("----------------end getOpenBurningFactors-----------------")
    }
    return res;

  }

}
