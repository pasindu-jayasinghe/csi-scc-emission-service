import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accelerators } from './accelerators.entity';
import { AcceleratorsService } from './accelerators.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

  @Crud({
    model: {
      type: Accelerators,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('Accelerators')
  export class AcceleratorsController implements CrudController<Accelerators> {
    constructor(
      public service: AcceleratorsService,
      @InjectRepository(Accelerators)
      private readonly repo: Repository<Accelerators>,
    ) {}
  
    get base(): CrudController<Accelerators> {
      return this;
    }
  
    @Post()
    create(@Body() createAcceleratorsDto: Accelerators) {

      return this.service.create(createAcceleratorsDto);
    }
  
 
  }
  