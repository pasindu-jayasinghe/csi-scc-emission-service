import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    BadRequestException,
    InternalServerErrorException,
    UseGuards,
  } from '@nestjs/common';
  import { Crud, CrudController } from '@nestjsx/crud';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { FuelFactor } from './fuel-factor.entity';
import { FuelFactorService } from './fuel-factor.service';
import { ConditionalFuelListReqDto } from '../dto/conditional-fuel-list-req.dto';
import { FuelService } from './fuel.service';
import { ConditionalFuelListResDto } from '../dto/conditional-fuel-list-res.dto';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: FuelFactor,  
    },
    query: {
      join: {
        
      },
    },
  })
  // @UseGuards(JwtAuthGuard)
  @Controller('fuelfactor')
  export class FuelFactorController implements CrudController<FuelFactor> {
    constructor(
      public service: FuelFactorService,
      @InjectRepository(FuelFactor)
      private readonly fuelFacRepository: Repository<FuelFactor>,
      public fuelService: FuelService
    ) {}
  
    get base(): CrudController<FuelFactor> {
      return this;
    }
  
    @Post()
    async create(@Body() createProjectDto: FuelFactor) {
      return this.service.create(createProjectDto);
    }
  

    @Post('get-ff')
    async getff(@Body() req: {emsource:string, source:string, industry:string, tier:string, year: number, countryCode: string, codes: any[] ,optional?: { parameter_unit?: String, stroke?: string }}){
      console.log("aaaaa",req)
      return await this.service.getFuelFactors2(req.emsource, req.source, req.industry, req.tier, req.year, req.countryCode, req.codes,req.optional)
    } 
  


    @ApiResponse({ status: 201, type: ConditionalFuelListResDto })
    @Post('conditional-fuel-list-req')
    async conditionalFuelListReq(@Body() req: ConditionalFuelListReqDto): Promise<ConditionalFuelListResDto> {
      const fuelFacsCodes = await this.service.conditionalFuelListReq(req);
      let fuels = await Promise.all(fuelFacsCodes.map(async ff => await this.fuelService.findOne({code: ff})))
      let res = new ConditionalFuelListResDto();
      res.fuels = fuels;        
      return res;
    }
  }
  