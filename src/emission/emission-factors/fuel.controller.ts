import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    BadRequestException,
    UseGuards,
  } from '@nestjs/common';
  import { Crud, CrudController } from '@nestjsx/crud';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { Fuel } from './fuel.entity';
import { FuelService } from './fuel.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: Fuel,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('fuel')
  export class FuelController implements CrudController<Fuel> {
    constructor(
      public service: FuelService,
      @InjectRepository(Fuel)
      private readonly fuelRepository: Repository<Fuel>,
    ) {}
  
    get base(): CrudController<Fuel> {
      return this;
    }
  
    @Post()
    async create(@Body() createProjectDto: Fuel) {

      let fuel = await this.fuelRepository.find({code: createProjectDto.code});
      if(fuel.length > 0){
        throw new BadRequestException("fuel is already saved", "fuel is already");
      }
      return this.service.create(createProjectDto);
    }

  }
