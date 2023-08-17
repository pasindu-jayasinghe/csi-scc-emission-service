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
import { FuelSpecific } from './fuel-specfic.entity';
import { FuelSpecificService } from './fuel-specific.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: FuelSpecific,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('fuelspecific')
  export class FuelSepecificController implements CrudController<FuelSpecific> {
    constructor(
      public service: FuelSpecificService,
      @InjectRepository(Fuel)
      private readonly fuelRepository: Repository<FuelSpecific>,
    ) {}
  
    get base(): CrudController<FuelSpecific> {
      return this;
    }
  
    @Post()
    create(@Body() createFueltDto: FuelSpecific) {

     var fp = new FuelSpecific();
     fp.year = createFueltDto.year;
     fp.code = createFueltDto.code;
     fp.country = createFueltDto.country;
     fp.ncv = createFueltDto.ncv;
     fp.density = createFueltDto.density;
     fp.unit_density = createFueltDto.unit_density;
     fp.unit_ncv = createFueltDto.unit_ncv;
    
    return this.service.create(fp);
    }

    @Post('get-fuel-specific')
    async getFuelSpecification(@Body() req: {year: number, countryCode: string,codes: any[] }){
      return await this.service.getFuelSpecification(req.year, req.countryCode, req.codes)
    }

  
  

  }
