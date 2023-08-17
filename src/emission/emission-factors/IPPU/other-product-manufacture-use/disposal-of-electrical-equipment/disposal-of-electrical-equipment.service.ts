import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DisposalElectricalEquipment } from './disposal-of-electrical-equipment.entity';


@Injectable()
export class DisposalElectricalEquipmentService extends TypeOrmCrudService<DisposalElectricalEquipment>{

    constructor(@InjectRepository(DisposalElectricalEquipment) repo,){super(repo)};

    async create(createDisposalElectricalEquipmentDto: DisposalElectricalEquipment) {
     

         return await this.repo.save(createDisposalElectricalEquipmentDto);
       }
 
}