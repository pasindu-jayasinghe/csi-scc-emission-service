import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParaffinWaxUse } from './paraffin-wax-use.entity';
import { ParaffinWaxUseService } from './paraffin-wax-use.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

  @Crud({
    model: {
      type: ParaffinWaxUse,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('ParaffinWaxUse')
  export class ParaffinWaxUseController implements CrudController<ParaffinWaxUse> {
    constructor(
      public service: ParaffinWaxUseService,
      @InjectRepository(ParaffinWaxUse)
      private readonly repo: Repository<ParaffinWaxUse>,
    ) {}
  
    get base(): CrudController<ParaffinWaxUse> {
      return this;
    }
  
    @Post()
    create(@Body() createParaffinWaxUseDto: ParaffinWaxUse) {

      return this.service.create(createParaffinWaxUseDto);
    }
  
 
  }
  