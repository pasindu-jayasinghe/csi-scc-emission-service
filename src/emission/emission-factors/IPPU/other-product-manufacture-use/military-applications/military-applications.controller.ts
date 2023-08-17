import {Controller, Get, Post, Body, Patch, Param, Delete,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilitaryApplications } from './military-applications.entity';
import { MilitaryApplicationsService } from './military-applications.service';

  @Crud({
    model: {
      type: MilitaryApplications,  
    },
    query: {
      join: {
        
      },
    },
  })

  @Controller('MilitaryApplications')
  export class MilitaryApplicationsController implements CrudController<MilitaryApplications> {
    constructor(
      public service: MilitaryApplicationsService,
      @InjectRepository(MilitaryApplications)
      private readonly repo: Repository<MilitaryApplications>,
    ) {}
  
    get base(): CrudController<MilitaryApplications> {
      return this;
    }
  
    @Post()
    create(@Body() createMilitaryApplicationsDto: MilitaryApplications) {

      return this.service.create(createMilitaryApplicationsDto);
    }
  
 
  }
  