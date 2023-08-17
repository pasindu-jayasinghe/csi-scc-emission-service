import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ForbiddenException,
    UseGuards,
  } from '@nestjs/common';
  import { Crud, CrudController } from '@nestjsx/crud';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Fuel } from './fuel.entity';
import { FuelService } from './fuel.service';
import { FuelPrice } from './fuel-price.entity';
import { FuelPriceService } from './fuel-price.service';
import { AnySrvRecord } from 'dns';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: FuelPrice,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('fuelprice')
  export class FuelPriceController implements CrudController<FuelPrice> {
    constructor(
      public service: FuelPriceService,
      @InjectRepository(Fuel)
      private readonly fuelRepository: Repository<FuelPrice>,
    ) {}
  
    get base(): CrudController<FuelPrice> {
      return this;
    }
  
    @Post()
    create(@Body() createFueltDto: FuelPrice) {
     var fp = new FuelPrice();
     fp.year = createFueltDto.year;
     fp.code = createFueltDto.code;
     fp.country = createFueltDto.country;
     fp.month = createFueltDto.month;
     fp.currency = createFueltDto.currency;
     fp.price = createFueltDto.price;

    return this.service.create(fp);
    }


    @Post('get-fuel-price')
    async getFuelPrice(@Body() req: {year:number ,month:number, curruncy:string,countryCode:string, codes:any[]}){
      return await this.service.getFuelPrice(req.year, req.month, req.curruncy, req.countryCode, req.codes)
    } 
  

  }
