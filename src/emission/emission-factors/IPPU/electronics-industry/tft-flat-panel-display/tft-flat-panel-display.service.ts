import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { TFTFlatPanelDisplay } from './tft-flat-panel-display.entity';


@Injectable()
export class TFTFlatPanelDisplayService extends TypeOrmCrudService<TFTFlatPanelDisplay>{

    constructor(@InjectRepository(TFTFlatPanelDisplay) repo,){super(repo)};

    async create(createTFTFlatPanelDisplayDto: TFTFlatPanelDisplay) {
     
       //console.log(createTFTFlatPanelDisplayDto)
         return await this.repo.save(createTFTFlatPanelDisplayDto);
       }
 
}
