import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { LubricantUse } from './lubricant-use.entity';


@Injectable()
export class LubricantUseService extends TypeOrmCrudService<LubricantUse>{

    constructor(@InjectRepository(LubricantUse) repo,){super(repo)};

    async create(createLubricantUseDto: LubricantUse) {
     
       console.log(createLubricantUseDto)
         return await this.repo.save(createLubricantUseDto);
       }
 
}
