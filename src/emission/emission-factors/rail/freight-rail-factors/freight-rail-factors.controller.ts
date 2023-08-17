import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Repository } from 'typeorm';
import { FreightRailFactors } from './freight-rail-factors.entity';
import { FreightRailFactorsService } from './freight-rail-factors.service';


@Crud({
    model: {
      type: FreightRailFactors,  
    },
    query: {
      join: {
        
      },
    },
  })
@UseGuards(JwtAuthGuard)
@Controller('freight-rail-factors')
export class FreightRailFactorsController implements CrudController<FreightRailFactors>{
    constructor(
        public service: FreightRailFactorsService,
        @InjectRepository(FreightRailFactors)
        private readonly repo: Repository<FreightRailFactors>,
    ) { }

    get base(): CrudController<FreightRailFactors> {
        return this;
    }

    @Post()
    create(@Body() createProjectDto: FreightRailFactors) {
      return this.service.create(createProjectDto);
    }


    @Post('get-freight-rail-factors')
    async getFreightRailFactors(@Body() req: {year:number, activity: string, type: string}){
      console.log("aaaaa",req)
      return await this.service.getFreightRailFactors(req.year, req.activity, req.type)
    }
}
