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
import { Fuel } from './fuel.entity';
import { FuelService } from './fuel.service';
import { Defra } from './defra.entity';
import { DefraService } from './defra.service';
import { defraDto } from '../dto/defra.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: Defra,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('defra')
  export class DefraController implements CrudController<Defra> {
    constructor(
      public service: DefraService,
      @InjectRepository(Defra)
      private readonly repo: Repository<Defra>,
    ) {}
  
    get base(): CrudController<Defra> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: Defra) {
      return this.service.create(createProjectDto);
    }


    @Post('get-defra')
    async getfwf(@Body() req: {year:number, tier: string, codes:any []}){
      console.log("aaaaa",req)
      return await this.service.getDefraFac(req.year, req.tier, req.codes)
    }
  

  }
