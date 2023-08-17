import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LubricantUse } from './lubricant-use.entity';
import { LubricantUseService } from './lubricant-use.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: LubricantUse,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('LubricantUse')
  export class LubricantUseController implements CrudController<LubricantUse> {
    constructor(
      public service: LubricantUseService,
      @InjectRepository(LubricantUse)
      private readonly repo: Repository<LubricantUse>,
    ) {}
  
    get base(): CrudController<LubricantUse> {
      return this;
    }
  
    @Post()
    create(@Body() createLubricantUseDto: LubricantUse) {

      return this.service.create(createLubricantUseDto);
    }
  
 
  }
  