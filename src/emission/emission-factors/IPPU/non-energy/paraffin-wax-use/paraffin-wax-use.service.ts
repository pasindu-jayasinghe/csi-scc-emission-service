import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ParaffinWaxUse } from './paraffin-wax-use.entity';


@Injectable()
export class ParaffinWaxUseService extends TypeOrmCrudService<ParaffinWaxUse>{

    constructor(@InjectRepository(ParaffinWaxUse) repo,){super(repo)};

    async create(createParaffinWaxDto: ParaffinWaxUse) {
     
       //console.log(createParaffinWaxDto)
         return await this.repo.save(createParaffinWaxDto);
       }
 
}
