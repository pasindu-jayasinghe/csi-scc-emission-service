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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: BiologicalTreatmentSolidWaste,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('BiologicalTreatmentSolidWaste')
  export class BiologicalTreatmentSolidWasteController implements CrudController<BiologicalTreatmentSolidWaste> {
    constructor(
      public service: BiologicalTreatmentSolidWasteService,
      @InjectRepository(BiologicalTreatmentSolidWaste)
      private readonly repo: Repository<BiologicalTreatmentSolidWaste>,
    ) {}
  
    get base(): CrudController<BiologicalTreatmentSolidWaste> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: BiologicalTreatmentSolidWaste) {

      return this.service.create(createProjectDto);
    }

    @Post('get-emission-factor')
    async getEmissionFactor(@Body() req: {gasType: string, wasteBasis: string, biologicalTreatmentSystem: string,
      wasteCategory: string, typeOfWaste: string, tier: string, countryCode: string}){
      console.log("aaaaa",req)
      return await this.service.getBiologicalTreatmentFactors(req.gasType, req.wasteBasis, req.biologicalTreatmentSystem, req.wasteCategory, req.typeOfWaste, req.tier, req.countryCode)
    } 
  
  
 
  }
  