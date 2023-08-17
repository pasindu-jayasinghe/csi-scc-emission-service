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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NetZeroFactor } from './netzero-factors.entity';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { NetZeroFactorService } from './netzero-factors.service';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
  
  @Crud({
    model: {
      type: NetZeroFactor,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('netzero-factor')
  export class NetZeroFactorController implements CrudController<NetZeroFactor> {
    constructor(
      public service: NetZeroFactorService,
      @InjectRepository(NetZeroFactor)
      private readonly repo: Repository<NetZeroFactor>,
    ) {}
  
    get base(): CrudController<NetZeroFactor> {
      return this;
    }


    @Post('common-ef-list')
    getCommonEFNames(): {data: string[], status: boolean}{
      let efNames = Object.values(netZeroFactors);
      return {
        status: true,
        data: efNames
      }
    }

    @Post('get-netzero-ef')
    async getCommonEfs(@Body() req: {year: number, countryCode: string, codes: any[]}){
      return await this.service.getFactors(req.year, req.countryCode, req.codes)
    }
  
 
  }
  