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
import { FuelFactor } from './fuel-factor.entity';
import { FuelFactorService } from './fuel-factor.service';
import { BiologicalTreatmentSolidWaste } from './biologicalTreatmentSolidWaste.entity';
import { BiologicalTreatmentSolidWasteService } from './biologicalTreatmentSolidWaste.service';
import { DomesticWWTreatmentDischarge } from './domestic-ww-treatment-discharge.entity';
import { DomesticWWTreatmentDischargeService } from './domestic-ww-treatment-discharge.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: DomesticWWTreatmentDischarge,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('DomesticWWTreatmentDischarge')
  export class DomesticWWTreatmentDischargeController implements CrudController<DomesticWWTreatmentDischarge> {
    constructor(
      public service: DomesticWWTreatmentDischargeService,
      @InjectRepository(DomesticWWTreatmentDischarge)
      private readonly repo: Repository<DomesticWWTreatmentDischarge>,
    ) {}
  
    get base(): CrudController<DomesticWWTreatmentDischarge> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: DomesticWWTreatmentDischarge) {

      return this.service.create(createProjectDto);
    }

    @Post('get-emission-factor')
    async getEmissionFactor(@Body() req: {treatmentDischargeType: string, tier: string}){
      console.log("aaaaa",req)
      return await this.service.getDomesticWasteWaterFactors(req.treatmentDischargeType, req.tier)
    } 
  
 
  }
  