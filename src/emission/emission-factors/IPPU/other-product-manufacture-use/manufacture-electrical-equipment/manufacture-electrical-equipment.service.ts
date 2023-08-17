import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ManufactureElectricalEquipment } from './manufacture-electrical-equipment.entity';


@Injectable()
export class ManufactureElectricalEquipmentService extends TypeOrmCrudService<ManufactureElectricalEquipment>{

    constructor(@InjectRepository(ManufactureElectricalEquipment) repo,){super(repo)};

    async create(createManufactureElectricalEquipmentDto: ManufactureElectricalEquipment) {
     

         return await this.repo.save(createManufactureElectricalEquipmentDto);
       }
 
}