import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,} from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TFTFlatPanelDisplay } from './tft-flat-panel-display.entity';
import { TFTFlatPanelDisplayService } from './tft-flat-panel-display.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

  
  @Crud({
    model: {
      type: TFTFlatPanelDisplay,  
    },
    query: {
      join: {
        
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Controller('TFTFlatPanelDisplay')
  export class TFTFlatPanelDisplayController implements CrudController<TFTFlatPanelDisplay> {
    constructor(
      public service: TFTFlatPanelDisplayService,
      @InjectRepository(TFTFlatPanelDisplay)
      private readonly repo: Repository<TFTFlatPanelDisplay>,
    ) {}
  
    get base(): CrudController<TFTFlatPanelDisplay> {
      return this;
    }
  
    @Post()
    create(@Body() createTFTFlatPanelDisplayDto: TFTFlatPanelDisplay) {

      return this.service.create(createTFTFlatPanelDisplayDto);
    }
  
 
  }
  