import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MedicalApplications } from './medical-applications.entity';


@Injectable()
export class MedicalApplicationsService extends TypeOrmCrudService<MedicalApplications>{

    constructor(@InjectRepository(MedicalApplications) repo,){super(repo)};

    async create(createMedicalApplicationsDto: MedicalApplications) {
     

         return await this.repo.save(createMedicalApplicationsDto);
       }
 
}