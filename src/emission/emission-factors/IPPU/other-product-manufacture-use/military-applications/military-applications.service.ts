import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MilitaryApplications } from './military-applications.entity';


@Injectable()
export class MilitaryApplicationsService extends TypeOrmCrudService<MilitaryApplications>{

    constructor(@InjectRepository(MilitaryApplications) repo,){super(repo)};

    async create(createMilitaryApplicationsDto: MilitaryApplications) {
     

         return await this.repo.save(createMilitaryApplicationsDto);
       }
 
}