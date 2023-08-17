import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeatTransferFluid } from './heat-transfer-fluid.entity';
import { HeatTransferFluidService } from './heat-transfer-fluid.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: HeatTransferFluid,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('HeatTransferFluid')
  export class HeatTransferFluidController implements CrudController<HeatTransferFluid> {
    constructor(
      public service: HeatTransferFluidService,
      @InjectRepository(HeatTransferFluid)
      private readonly repo: Repository<HeatTransferFluid>,
    ) {}
  
    get base(): CrudController<HeatTransferFluid> {
      return this;
    }
  
    @Post()
    create(@Body() createHeatTransferFluidDto: HeatTransferFluid) {

      return this.service.create(createHeatTransferFluidDto);
    }
  
 
  }
  