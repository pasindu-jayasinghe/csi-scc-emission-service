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
import { OpenBurningOfWaste } from './open-burning-of-waste.entity';
import { OpenBurningOfWasteService } from './open-burning-of-waste.service';
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
  @Controller('openBurningOfWaste')
  export class OpenBurningOfWasteController implements CrudController<OpenBurningOfWaste> {
    constructor(
      public service: OpenBurningOfWasteService,
      @InjectRepository(Fuel)
      private readonly repo: Repository<OpenBurningOfWaste>,
    ) {}
  
    get base(): CrudController<OpenBurningOfWaste> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: OpenBurningOfWaste) {

      return this.service.create(createProjectDto);
    }

    @Post('get-emission-factor')
    async getEmissionFactor(@Body() req: {gasType: string, mswType: string,
      wasteCategory: string, typeOfWaste: string, tier: string, countryCode: string}){
      console.log("aaaaa",req)
      return await this.service.getOpenBurningFactors(req.gasType, req.mswType, req.wasteCategory, req.typeOfWaste, req.tier, req.countryCode)
    } 
  

  }
