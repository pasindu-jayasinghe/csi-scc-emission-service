import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { IntergratedCircuit } from './intergrated-circuit.entity';


@Injectable()
export class IntergratedCircuitService extends TypeOrmCrudService<IntergratedCircuit>{

    constructor(@InjectRepository(IntergratedCircuit) repo,){super(repo)};

    async create(createIntergratedCircuitDto: IntergratedCircuit) {
     
       //console.log(createIntergratedCircuitDto)
         return await this.repo.save(createIntergratedCircuitDto);
       }
 
}
