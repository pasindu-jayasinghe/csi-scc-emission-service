import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { ExcellUploadable } from 'src/emission/services/excell-uploadale';
import { NetZeroFactor } from './netzero-factors.entity';






@Injectable()
export class NetZeroFactorService extends TypeOrmCrudService<NetZeroFactor>  implements ExcellUploadable{


    private excelBulkVariableMapping: {code: string, name: string}[] = [    
        {code: "code", name: 'code'},
        {code: "name", name: 'name'},
        {code: "countryCode", name: "countryCode"},
        {code: "year", name: "year"},
        {code: "unit", name: "unit"},
        {code: "reference", name: "reference"},
        {code: "value", name: "value"},

      
      ]


    constructor(@InjectRepository(NetZeroFactor) repo,){super(repo);}


    downlodExcellBulkUploadVariableMapping() {

        return this.excelBulkVariableMapping;

    }

    async excellBulkUpload( data: any, variable_mapping: any[], year: number) {
    
        console.log("data",data)
        let dto = new NetZeroFactor();
      
      
        this.excelBulkVariableMapping.forEach(vm=>{
            if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
                dto[vm.code] = data[vm.name]
          }
        })
        console.log("dto",dto)

       
        try{      

            let comfac = await this.repo.find({ code: dto.code,name:dto.name ,countryCode:dto.countryCode,year:dto.year,unit:dto.unit});
           if (comfac.length > 0) {
               throw new BadRequestException("fuel-fac is already saved", "fuel-fac is already");
           }
           else{
            return this.repo.save(dto);

           }
        }catch(err){
          console.log(err);
          return null;
        }
      }

    public async getNetZeroFactors(year: number, countryCode: string, emsource:string, codes: netZeroFactors[]): Promise<any> {

    console.log("PPPP",{year:year,countryCode:countryCode,codes:codes})
        codes = codes.filter((item) => typeof item !== "undefined");
         if(codes.length>0){
        let factors = await this.repo.createQueryBuilder()
            .where("countryCode = :countryCode AND year = :year AND emsource = :emsource AND code IN (:...codes) ",  { 
                countryCode: countryCode, year: year, emsource: emsource, codes: codes
            })
            .getMany();
    

        let res = {};
        for await (const code of codes) {

            let factor = factors.find(f => f.code === code)?.value;            
            if(factor === undefined || factor === null){
                factor = await this.getLatusFactor(code, countryCode);            
            }
            res[code] = factor;
        }

        return res;}
        else{return {}}
    }

    private async getLatusFactor(code: netZeroFactors, countryCode: string): Promise<number>{

        let factor = await this.repo.createQueryBuilder()
            .where("countryCode = :countryCode AND code = :code",  { 
                countryCode: countryCode, code: code
            })
            .orderBy('year', 'DESC')
            .limit(1)
            .getMany();
        if(factor && factor.length > 0){
            return factor[0].value
        }else{
            return -1; // TODO: 
        }
    }

    async getFactors(year: number, countryCode: string, codes: netZeroFactors[]): Promise<any> {

        let factors = await this.repo.createQueryBuilder()
        .where("countryCode = :countryCode AND year = :year AND code IN (:...codes)",  { 
            countryCode: countryCode, year: year, codes: codes
        })
        .getMany();

        let res = []
        for await (const code of codes) {
            let factor = factors.find(f => f.code === code);            
            if(factor === undefined || factor === null){
                factor = await this.getLatest(code, countryCode);           
            } 
            if (factor !== undefined) res.push(factor)
        }

        return res
    }

    async getLatest(code: netZeroFactors, countryCode: string): Promise<any>{
        let factor = await this.repo.createQueryBuilder()
        .where("countryCode = :countryCode AND code = :code",  { 
            countryCode: countryCode, code: code
        })
        .orderBy('year', 'DESC')
        .limit(1)
        .getMany();

        if(factor && factor.length > 0){
            return factor[0]
        }
    }

}
