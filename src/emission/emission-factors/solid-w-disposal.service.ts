import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Fuel } from './fuel.entity';
import { SolidWasteDisposal } from './solid-w-disposal.entity';
import { WasteIncineration } from './waste-incineration.entity';

@Injectable()
export class SolidWasteDisposalService extends TypeOrmCrudService<SolidWasteDisposal>{

  constructor(@InjectRepository(SolidWasteDisposal) repo,) { super(repo) };

  async create(createFuelDto: SolidWasteDisposal) {

    console.log(createFuelDto)
    return await this.repo.save(createFuelDto);
  }

  public async getSolidWasteFactors(approach: string, climateZone: string, tier: string): Promise<any> {

    let filter: string = "fac.approach = :approach AND fac.climateZone = :climateZone AND fac.tier = :tier";

  const data = this.repo.createQueryBuilder("fac")
    .where(filter,
      { approach: approach, climateZone: climateZone, tier: tier })

  let factor = await data.getMany()

  let res = {};
  res = factor;

  if (res === -1) {
    console.log("---------------start getSolidWasteFactors------------------")
    console.log(climateZone, tier);
    console.log("getSolidWasteFactors --- ", res);
    console.log("----------------end getSolidWasteFactors-----------------")
  }
  return res;

}

}
