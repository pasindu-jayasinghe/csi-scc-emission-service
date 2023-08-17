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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: WasteIncineration,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('wasteIncineration')
  export class WasteIncinerationController implements CrudController<WasteIncineration> {
    constructor(
      public service: WasteIncinerationService,
      @InjectRepository(Fuel)
      private readonly repo: Repository<WasteIncineration>,
    ) {}
  
    get base(): CrudController<WasteIncineration> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: WasteIncineration) {

      return this.service.create(createProjectDto);
    }

    @Post('get-emission-factor')
    async getEmissionFactor(@Body() req: {gasType: string, mswType: string,
      wasteCategory: string, typeOfWaste: string, tier: string, countryCode: string}){
      console.log("aaaaa",req)
      return await this.service.getWasteIncinerationFactors(req.gasType, req.mswType, req.wasteCategory, req.typeOfWaste, req.tier, req.countryCode)
    } 

  }
