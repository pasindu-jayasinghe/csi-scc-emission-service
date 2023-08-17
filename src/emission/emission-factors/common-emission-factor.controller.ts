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
import { BiologicalTreatmentSolidWaste } from './biologicalTreatmentSolidWaste.entity';
import { BiologicalTreatmentSolidWasteService } from './biologicalTreatmentSolidWaste.service';
import { CommonEmissionFactor } from './common-emission-factor.entity';
import { CommonEmissionFactorService } from './common-emission-factor.service';
import { emissionFactors } from '../enum/emissionFactors.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: CommonEmissionFactor,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('common-emission-factor')
  export class CommonEmissionFactorController implements CrudController<CommonEmissionFactor> {
    constructor(
      public service: CommonEmissionFactorService,
      @InjectRepository(CommonEmissionFactor)
      private readonly repo: Repository<CommonEmissionFactor>,
    ) {}
  
    get base(): CrudController<CommonEmissionFactor> {
      return this;
    }


    @Post('common-ef-list')
    getCommonEFNames(): {data: string[], status: boolean}{
      let efNames = Object.values(emissionFactors);
      return {
        status: true,
        data: efNames
      }
    }

    @Post('get-common-ef')
    async getCommonEfs(@Body() req: {year: number, countryCode: string, codes: any[]}){
      return await this.service.getFactors(req.year, req.countryCode, req.codes)
    }
  
 
  }
  