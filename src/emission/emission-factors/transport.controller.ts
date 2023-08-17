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
import { TransportService } from './transport.service';
import { Transport } from './transport.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: Transport,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('transfac')
  export class TransportController implements CrudController<Transport> {
    constructor(
      public service: TransportService,
      @InjectRepository(Transport)
      private readonly repo: Repository<Transport>,
    ) {}
  
    get base(): CrudController<Transport> {
      return this;
    }
  
    @Post()
    create(@Body() createProjectDto: Transport) {

      return this.service.create(createProjectDto);
    }
  

    @Post('get-tf')
    async getTfac(@Body() req: {year: number, countryCode: string, codes: any}){
      console.log("aaaaa",req)
      return await this.service.getTransFac(req.codes)
    }
  

  }
