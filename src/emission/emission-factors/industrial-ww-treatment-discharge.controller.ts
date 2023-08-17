import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { Crud, CrudController } from '@nestjsx/crud';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Fuel } from './fuel.entity';
import { FuelService } from './fuel.service';
import { WasteIncineration } from './waste-incineration.entity';
import { WasteIncinerationService } from './waste-incineration.service';
import { IndustrialWWTreatmentDischarge } from './industrial-ww-treatment-discharge.entity';
import { IndustrialWWTreatmentDischargeService } from './industrial-ww-treatment-discharge.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: IndustrialWWTreatmentDischarge,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('industrialWWTreatmentDischarge')
  export class IndustrialWWTreatmentDischargeController implements CrudController<IndustrialWWTreatmentDischarge> {
    constructor(
      public service: IndustrialWWTreatmentDischargeService,
      @InjectRepository(Fuel)
      private readonly repo: Repository<IndustrialWWTreatmentDischarge>,
    ) {}
  
    get base(): CrudController<IndustrialWWTreatmentDischarge> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: IndustrialWWTreatmentDischarge) {

      return this.service.create(createProjectDto);
    }

    @Post('get-emission-factor')
    async getEmissionFactor(@Body() req: {treatmentDischargeType: string, tier: string}){
      console.log("aaaaa",req)
      return await this.service.getIndustrialWasteWaterFactors(req.treatmentDischargeType, req.tier)
    } 
  

  }
