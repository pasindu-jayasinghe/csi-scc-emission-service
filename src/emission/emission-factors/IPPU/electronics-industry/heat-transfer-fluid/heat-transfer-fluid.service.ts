import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { HeatTransferFluid } from './heat-transfer-fluid.entity';


@Injectable()
export class HeatTransferFluidService extends TypeOrmCrudService<HeatTransferFluid>{

    constructor(@InjectRepository(HeatTransferFluid) repo,){super(repo)};

    async create(createHeatTransferFluidDto: HeatTransferFluid) {
     
       //console.log(createHeatTransferFluidDto)
         return await this.repo.save(createHeatTransferFluidDto);
       }
 
}
