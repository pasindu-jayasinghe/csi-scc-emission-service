import { BadRequestException, Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Certificate } from 'crypto';
import { ExcellUploadable } from '../services/excell-uploadale';
import { FreightWaterFac } from './freight-w-factor.entity';


@Injectable()
export class FreightWaterFacService extends TypeOrmCrudService<FreightWaterFac> implements ExcellUploadable {

  constructor(@InjectRepository(FreightWaterFac) repo,) { super(repo) };


  private excelBulkVariableMapping: { code: string, name: string }[] = [
    { code: "activity", name: 'Activity' },
    { code: "type", name: 'Type' },
    { code: "size", name: "Size" },
    { code: "year", name: "year" },
    { code: "kgco2e", name: "kgco2e" },
    { code: "kgco2", name: "kgco2" },
    { code: "kgch4", name: "kgch4" },
    { code: "kgn20", name: "kgn20" },
  ]


  downlodExcellBulkUploadVariableMapping() {

    return this.excelBulkVariableMapping;

  }

  async excellBulkUpload(data: any, variable_mapping: any[], year: number) {

    console.log("data", data)
    let dto = new FreightWaterFac();

    this.excelBulkVariableMapping.forEach(vm => {
      if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
        dto[vm.code] = data[vm.name]
      }
    })
    console.log("dto", dto)


    try {
      let fwfac = await this.repo.find({ activity: dto.activity, type: dto.type, size: dto.size, year: dto.year });
      if (fwfac.length > 0) {
        throw new BadRequestException("factor is already saved", "factor is already");
      

      } else {
        return this.repo.save(dto);

      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async create(createfwflDto: FreightWaterFac) {

    var fwfac = new FreightWaterFac();
    fwfac.activity = createfwflDto.activity;
    fwfac.type = createfwflDto.type;
    fwfac.kgch4 = createfwflDto.kgch4;
    fwfac.kgco2 = createfwflDto.kgco2;
    fwfac.kgco2e = createfwflDto.kgco2e;
    fwfac.kgn20 = createfwflDto.kgn20;
    fwfac.size = createfwflDto.size
    fwfac.year = createfwflDto.year.substring(0, 4);

    return await this.repo.save(fwfac);
  }



  public async getFreightWFac(year: number, activity: string, type: string, size: string): Promise<any> {

    console.log(
      {
        year: year,
        activity: activity,
        type: type,
        size: size
      }

    )
    let res = {};

    let factor = await this.repo.createQueryBuilder("fr")
      .where("fr.year = :year AND fr.activity = :activity AND fr.type = :type AND fr.size = :size",
        { year: year, activity: activity, type: type, size: size })

      .getOne()

    //console.log(factor.getQuery())

    if (factor === undefined || factor === null) {
      factor = await this.getLatusFactor(activity, type, size);
    }
    res = factor;

    return res
  }




  async getLatusFactor(activity: string, type: string, size: string): Promise<any> {
    const factor = await this.repo.createQueryBuilder("fr")
      .where("fr.activity = :activity AND fr.type = :type AND fr.size = :size ",
        {
          activity: activity, type: type, size: size
        })
      .orderBy('year', 'DESC')
      .limit(1)
      .getMany();
    if (factor && factor.length > 0) {
      return factor[0]
    } else {
      return -1; // TODO: 
    }
  }
}