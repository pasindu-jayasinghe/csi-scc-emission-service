import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManufactureElectricalEquipment } from './manufacture-electrical-equipment.entity';
import { ManufactureElectricalEquipmentService } from './manufacture-electrical-equipment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

  @Crud({
    model: {
      type: ManufactureElectricalEquipment,  
    },
    query: {
      join: {
        
      },
    },
  })

  @UseGuards(JwtAuthGuard)
  @Controller('ManufactureElectricalEquipment')
  export class ManufactureElectricalEquipmentController implements CrudController<ManufactureElectricalEquipment> {
    constructor(
      public service: ManufactureElectricalEquipmentService,
      @InjectRepository(ManufactureElectricalEquipment)
      private readonly repo: Repository<ManufactureElectricalEquipment>,
    ) {}
  
    get base(): CrudController<ManufactureElectricalEquipment> {
      return this;
    }
  
    @Post()
    create(@Body() createManufactureElectricalEquipmentDto: ManufactureElectricalEquipment) {

      return this.service.create(createManufactureElectricalEquipmentDto);
    }
  
 
  }
  