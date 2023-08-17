import { Controller, Get, Post,Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incineration } from './incineration.entity';
import { MunicipalWaterTariff } from './municipalWaterTariff.entity';
import { MunicipalWaterTariffService } from './municipalWaterTariff.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: MunicipalWaterTariff,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('municipal-water-tariff')
  export class MunicipalWaterTariffController implements CrudController<MunicipalWaterTariff> {
    constructor(
      public service: MunicipalWaterTariffService,
      @InjectRepository(MunicipalWaterTariff)
      private readonly repo: Repository<MunicipalWaterTariff>,
    ) {}
  
    get base(): CrudController<MunicipalWaterTariff> {
      return this;
    }
  
    @Post()
    create(@Body() createMunicipalWaterTariffDto: MunicipalWaterTariff) {
      return this.service.create(createMunicipalWaterTariffDto);
    }


    @Post('get-municipal-water-tariff')
    async getMunicipalWaterTariffFac(@Body() req: { year:number, codes:any []}){

      return await this.service.getMunicipalWaterTariffFac(req.year, req.codes)
    }
  

  }
