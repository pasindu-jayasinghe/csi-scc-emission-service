import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntergratedCircuit } from './intergrated-circuit.entity';
import { IntergratedCircuitService } from './intergrated-circuit.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  
  @Crud({
    model: {
      type: IntergratedCircuit,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('IntergratedCircuit')
  export class IntergratedCircuitController implements CrudController<IntergratedCircuit> {
    constructor(
      public service: IntergratedCircuitService,
      @InjectRepository(IntergratedCircuit)
      private readonly repo: Repository<IntergratedCircuit>,
    ) {}
  
    get base(): CrudController<IntergratedCircuit> {
      return this;
    }
  
    @Post()
    create(@Body() createIntergratedCircuitDto: IntergratedCircuit) {

      return this.service.create(createIntergratedCircuitDto);
    }
  
 
  }
  