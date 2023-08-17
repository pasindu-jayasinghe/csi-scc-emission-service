import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Photovoltaics } from './photovoltaics.entity';


@Injectable()
export class PhotovoltaicsService extends TypeOrmCrudService<Photovoltaics>{

    constructor(@InjectRepository(Photovoltaics) repo,){super(repo)};

    async create(createPhotovoltaicsDto: Photovoltaics) {
     
       //console.log(createPhotovoltaicsDto)
         return await this.repo.save(createPhotovoltaicsDto);
       }
 
}
