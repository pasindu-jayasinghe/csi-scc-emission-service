import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photovoltaics } from './photovoltaics.entity';
import { PhotovoltaicsService } from './photovoltaics.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: Photovoltaics,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('Photovoltaics')
  export class PhotovoltaicsController implements CrudController<Photovoltaics> {
    constructor(
      public service: PhotovoltaicsService,
      @InjectRepository(Photovoltaics)
      private readonly repo: Repository<Photovoltaics>,
    ) {}
  
    get base(): CrudController<Photovoltaics> {
      return this;
    }
  
    @Post()
    create(@Body() createPhotovoltaicsDto: Photovoltaics) {

      return this.service.create(createPhotovoltaicsDto);
    }
  
 
  }
  