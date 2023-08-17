import { Controller, Get, Post,Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incineration } from './incineration.entity';
import { IncinerationService } from './incineration.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: Incineration,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('incineration')
  export class IncinerationController implements CrudController<Incineration> {
    constructor(
      public service: IncinerationService,
      @InjectRepository(Incineration)
      private readonly repo: Repository<Incineration>,
    ) {}
  
    get base(): CrudController<Incineration> {
      return this;
    }
  
    @Post()
    create(@Body() createIncinerationDto: Incineration) {
      return this.service.create(createIncinerationDto);
    }


    @Post('get-incineration')
    async getIncinerationFac(@Body() req: {year:number, codes:any []}){

      return await this.service.getIncinerationFac(req.year,  req.codes)
    }
  

  }
