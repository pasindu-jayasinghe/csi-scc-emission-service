import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ExcellUploadable } from '../services/excell-uploadale';
import { MunicipalWaterTariff } from './municipalWaterTariff.entity';


@Injectable()
export class MunicipalWaterTariffService extends TypeOrmCrudService<MunicipalWaterTariff>implements ExcellUploadable{

    constructor(@InjectRepository(MunicipalWaterTariff) repo,){super(repo)};
  
    private excelBulkVariableMapping: {code: string, name: string}[] = [    
      {code: "category", name: 'category'},
      {code: "year", name: 'year'},
      {code: "vat", name: "vat"},
      {code: "year", name: "year"},
      {code: "usageCharge", name: "usageCharge"},
      {code: "defaultMonthlyServiceCharge", name: "defaultMonthlyServiceCharge"},

      {code: "lowerLevel_1", name: "lowerLevel_1"},
      {code: "upperLevel_1", name: "upperLevel_1"},
      {code: "monthlyServiceCharge_1", name: "monthlyServiceCharge_1"},
      
      {code: "lowerLevel_2", name: "lowerLevel_2"},
      {code: "upperLevel_2", name: "upperLevel_2"},
      {code: "monthlyServiceCharge_2", name: "monthlyServiceCharge_2"},

      {code: "lowerLevel_3", name: "lowerLevel_3"},
      {code: "upperLevel_3", name: "upperLevel_3"},
      {code: "monthlyServiceCharge_3", name: "monthlyServiceCharge_3"},
      
      {code: "lowerLevel_4", name: "lowerLevel_4"},
      {code: "upperLevel_4", name: "upperLevel_4"},
      {code: "monthlyServiceCharge_4", name: "monthlyServiceCharge_4"},

      {code: "lowerLevel_5", name: "lowerLevel_5"},
      {code: "upperLevel_5", name: "upperLevel_5"},
      {code: "monthlyServiceCharge_5", name: "monthlyServiceCharge_5"},

      {code: "lowerLevel_6", name: "lowerLevel_6"},
      {code: "upperLevel_6", name: "upperLevel_6"},
      {code: "monthlyServiceCharge_6", name: "monthlyServiceCharge_6"},
    
      {code: "lowerLevel_7", name: "lowerLevel_7"},
      {code: "upperLevel_7", name: "upperLevel_7"},
      {code: "monthlyServiceCharge_7", name: "monthlyServiceCharge_7"},
    
      {code: "lowerLevel_8", name: "lowerLevel_8"},
      {code: "upperLevel_8", name: "upperLevel_8"},
      {code: "monthlyServiceCharge_8", name: "monthlyServiceCharge_8"},
  
    
    ]

    downlodExcellBulkUploadVariableMapping() {

      return this.excelBulkVariableMapping;

  }

  async excellBulkUpload( data: any, variable_mapping: any[], year: number) {
  
      console.log("data",data)
      let dto = new MunicipalWaterTariff();
  
    
      this.excelBulkVariableMapping.forEach(vm=>{
        if(data[vm.name]){
          dto[vm.code] = data[vm.name]
        }
      })
      console.log("dto",dto)

     
      try{      

        
        let fuelspe = await this.repo.find({ category: dto.category, year: dto.year });
        if (fuelspe.length > 0) {
            throw new BadRequestException("factor is already saved", "factor is already");
        }
        else{
          return this.repo.save(dto);

        }
      }catch(err){
        console.log(err);
        return null;
      }
    }


    async create(createMunicipalWaterTariffDto: MunicipalWaterTariff) {
     
       console.log(createMunicipalWaterTariffDto)
         return await this.repo.save(createMunicipalWaterTariffDto);
       }
 

       public async getMunicipalWaterTariffFac( year:number, codes:any[]):Promise<any>{
        console.log("cccc",codes)


        const factors = await this.repo.createQueryBuilder("municipalwater")
        .where("municipalwater.year = :year AND municipalwater.category IN (:...codes)" , 
        { year: year, codes:codes})
    
        .getMany()

        console.log("fff",factors)
    
    
    
        let res = {};
        for await (const category of codes) {
            console.log("category",category)
           let factor = factors.find(f => f.category === category);            
           if(factor === undefined || factor === null){
               factor = await this.getLatusFactor(category,year);            
           }
            res = factor;
        }
        console.log(res)
        return res;
    
    }
  
    async getLatusFactor(category: any,year:number): Promise<any> {
      let filter: string = "municipalwater.category = :category AND municipalwater.year <:year"
      const factor = await this.repo.createQueryBuilder("municipalwater")
      .where(filter , 
      { 
        category: category ,
        year: year

      })
      .orderBy('year', 'DESC')
      .limit(1)
      .getMany();
      if(factor && factor.length > 0){
          return factor[0]
      }else{
          return -1; // TODO: 
      }
  
  }

}
