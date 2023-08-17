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
import { FreightWaterFac } from './freight-w-factor.entity';
import { FreightWaterFacService } from './freight-w-factor.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Crud({
    model: {
        type: FreightWaterFac,
    },
    query: {
        join: {

        },
    },
})
@UseGuards(JwtAuthGuard)
@Controller('FreightWaterFac')
export class FreightWaterFacController implements CrudController<FreightWaterFac> {
    constructor(
        public service: FreightWaterFacService,
        @InjectRepository(FreightWaterFac)
        private readonly repo: Repository<FreightWaterFac>,
    ) { }

    get base(): CrudController<FreightWaterFac> {
        return this;
    }

    @Post()
    create(@Body() createProjectDto: FreightWaterFac) {

        var fwfac = new FreightWaterFac();
        

        console.log(createProjectDto)
        
        // createFueltDto.year = createFueltDto.year.substring(0,4);

        return this.service.create(createProjectDto);
    }

    @Post('get-fwf')
    async getfwf(@Body() req: {year:number, activity: string, type: string, size:string}){
      console.log("aaaaa",req)
      return await this.service.getFreightWFac(req.year, req.activity, req.type,req.size)
    }
  


}
