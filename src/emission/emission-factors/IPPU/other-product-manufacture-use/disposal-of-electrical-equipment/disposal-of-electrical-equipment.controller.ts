import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisposalElectricalEquipment } from './disposal-of-electrical-equipment.entity';
import { DisposalElectricalEquipmentService } from './disposal-of-electrical-equipment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

  @Crud({
    model: {
      type: DisposalElectricalEquipment,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('DisposalElectricalEquipment')
  export class DisposalElectricalEquipmentController implements CrudController<DisposalElectricalEquipment> {
    constructor(
      public service: DisposalElectricalEquipmentService,
      @InjectRepository(DisposalElectricalEquipment)
      private readonly repo: Repository<DisposalElectricalEquipment>,
    ) {}
  
    get base(): CrudController<DisposalElectricalEquipment> {
      return this;
    }
  
    @Post()
    create(@Body() createDisposalElectricalEquipmentDto: DisposalElectricalEquipment) {

      return this.service.create(createDisposalElectricalEquipmentDto);
    }
  
 
  }
  