import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { fuelType } from '../enum/fuelType.enum';
import { ExcellUploadable } from '../services/excell-uploadale';
import { FuelPrice } from './fuel-price.entity';
import { Fuel } from './fuel.entity';

@Injectable()
export class FuelPriceService extends TypeOrmCrudService<FuelPrice> implements ExcellUploadable{

    constructor(@InjectRepository(FuelPrice) repo,){super(repo)};

    private excelBulkVariableMapping: {code: string, name: string}[] = [    
        {code: "code", name: 'fuel code'},
        {code: "country", name: 'country'},
        {code: "month", name: 'month'},
        {code: "year", name: "year"},
        {code: "currency", name: "currency"},
        {code: "price", name: "price"},


      ]

      downlodExcellBulkUploadVariableMapping() {

        return this.excelBulkVariableMapping;

    }
    async excellBulkUpload( data: any, variable_mapping: any[], year: number) {
    
        console.log("data",data)
        let dto = new FuelPrice();
      
       // dto.year = year;
      
        this.excelBulkVariableMapping.forEach(vm=>{
            if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
                dto[vm.code] = data[vm.name]
          }
        })
        console.log("dto",dto)

       
        try{      
            let fuelprice = await this.repo.find({ code: dto.code,country:dto.country,year:dto.year,month:dto.month,currency:dto.currency });
           if (fuelprice.length > 0) {
               throw new BadRequestException("fuel-price is already saved", "fuel-price is already");
           }
           else{
            return this.repo.save(dto);

           }

        }catch(err){
          console.log(err);
          return null;
        }
      }

    public async getFuelPrice(year:number ,month:number, curruncy:string,countryCode:string, codes:fuelType[]):Promise<any>{


      const factors = await this.repo.createQueryBuilder("fuelprice")
      .where("fuelprice.year = :year AND fuelprice.month = :month AND fuelprice.currency = :curruncy AND  fuelprice.country = :countryCode AND fuelprice.code IN (:...codes)" , 
      { year: year, month:month, curruncy:curruncy, countryCode: countryCode ,codes:codes})
  
      .getMany()
  
      console.log("ssssss--",factors);
  
  
      let res = {};
      for await (const code of codes) {
         let factor = factors.find(f => f.code === code);            
         if(factor === undefined || factor === null){
             factor = await this.getLatusFactor(code, countryCode, curruncy, year.toString(),month);            
         }
          res = factor;
      }

      if(res === -1){
        console.log("---------------start FuelPrice------------------")
        console.log(year,month, curruncy, countryCode, codes);
        console.log("FuelSpecific --- ",res);
        console.log("---------------end FuelPrice------------------")
      }
      return res;
  
  }

  async getLatusFactor(code: fuelType, countryCode: string, curruncy:string, year: string, month: number): Promise<any> {
    let q =  this.repo.createQueryBuilder("fuelprice")
    .where("fuelprice.country = :countryCode AND fuelprice.currency = :curruncy AND fuelprice.code = :code" , 
    { 
        countryCode: countryCode, code: code, curruncy:curruncy
    })
    .orderBy('year', 'DESC')
    // .limit(1)

    // console.log(q.getQuery());
    let factor = await q.getMany();

    let temp = factor.filter(f => f.year <= year)
    if(temp.length>0){
        factor = temp.sort((a,b)=> {
            let d1 =new Date();
            d1.setFullYear( parseInt(a.year));
            d1.setMonth(a.month)
            let d2 =new Date();
            d2.setFullYear( parseInt(b.year));
            d2.setMonth(b.month)

            return d1 < d2 ? 1: -1;
        });

        let temp2 = factor.filter(f => {
            if(f.year===year){
                if(f.month == 12){
                    return true
                }else{
                    return f.month <= month
                }
            }else{
                return true;
            }
        });
        if(temp2.length>0){
            factor = temp2;
        }else{
            factor = [];
        }
    }else{
        factor=[];
    }





    if(factor && factor.length > 0){
        return factor[0];
    }else{
        return -1; // TODO: 
    }

}

    async create(createFuelPriceDto: FuelPrice) {
     
       console.log("ssss",createFuelPriceDto)
         return await this.repo.save(createFuelPriceDto);
       }
 
}
