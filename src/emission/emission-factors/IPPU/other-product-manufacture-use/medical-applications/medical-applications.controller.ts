import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalApplications } from './medical-applications.entity';
import { MedicalApplicationsService } from './medical-applications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

  @Crud({
    model: {
      type: MedicalApplications,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('MedicalApplications')
  export class MedicalApplicationsController implements CrudController<MedicalApplications> {
    constructor(
      public service: MedicalApplicationsService,
      @InjectRepository(MedicalApplications)
      private readonly repo: Repository<MedicalApplications>,
    ) {}
  
    get base(): CrudController<MedicalApplications> {
      return this;
    }
  
    @Post()
    create(@Body() createMedicalApplicationsDto: MedicalApplications) {

      return this.service.create(createMedicalApplicationsDto);
    }
  
 
  }
  