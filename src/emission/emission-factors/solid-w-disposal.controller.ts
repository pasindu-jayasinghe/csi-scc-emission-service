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
import { SolidWasteDisposal } from './solid-w-disposal.entity';
import { SolidWasteDisposalService } from './solid-w-disposal.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: SolidWasteDisposal,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('SolidWasteDisposal')
  export class SolidWasteDisposalController implements CrudController<SolidWasteDisposal> {
    constructor(
      public service: SolidWasteDisposalService,
      @InjectRepository(SolidWasteDisposal)
      private readonly repo: Repository<SolidWasteDisposal>,
    ) {}
  
    get base(): CrudController<SolidWasteDisposal> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: SolidWasteDisposal) {

      return this.service.create(createProjectDto);
    }
  
    @Post('get-emission-factor')
    async getEmissionFactor(@Body() req: {approach: string, climateZone: string, tier: string}){
      console.log("aaaaa",req)
      return await this.service.getSolidWasteFactors(req.approach, req.climateZone, req.tier)
    } 

  }
