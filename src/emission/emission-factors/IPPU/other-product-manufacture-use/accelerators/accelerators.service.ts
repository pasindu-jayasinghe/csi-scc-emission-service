import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Accelerators } from './accelerators.entity';


@Injectable()
export class AcceleratorsService extends TypeOrmCrudService<Accelerators>{

    constructor(@InjectRepository(Accelerators) repo,){super(repo)};

    async create(createAcceleratorsDto: Accelerators) {
     

         return await this.repo.save(createAcceleratorsDto);
       }
 
}