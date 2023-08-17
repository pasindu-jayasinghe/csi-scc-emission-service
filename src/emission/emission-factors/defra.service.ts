import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Tier } from '../enum/tier.enum';
import { ExcellUploadable } from '../services/excell-uploadale';
import { Defra } from './defra.entity';
import { Fuel } from './fuel.entity';

@Injectable()
export class DefraService extends TypeOrmCrudService<Defra> implements ExcellUploadable{


    private excelBulkVariableMapping: {code: string, name: string}[] = [    
        {code: "code", name: 'code'},
        {code: "name", name: 'name'},
        {code: "tier", name: "tier"},
        {code: "year", name: "year"},
        {code: "reUse", name: "reUse"},
        {code: "openLoop", name: "openLoop"},
        {code: "closedLoop", name: "closedLoop"},
        {code: "combution", name: "combution"},
        {code: "composting", name: "composting"},
        {code: "landFill", name: "landFill"},
        {code: "AnaeriobicDigestions", name: "AnaeriobicDigestions"},
        {code: "PiggeryFeeding", name: "PiggeryFeeding"},
        {code: "Incineration", name: "Incineration"},
        
      ]


      downlodExcellBulkUploadVariableMapping() {

        return this.excelBulkVariableMapping;

    }

    async excellBulkUpload( data: any, variable_mapping: any[], year: number) {
    console.log('dara',data)
        let dto = new Defra();
            
        this.excelBulkVariableMapping.forEach(vm=>{
          if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
            dto[vm.code] = data[vm.name]
            console.log(vm.code ,dto[vm.code])
          }
        })



       
        try{      

            let defr = await this.repo.find({ code: dto.code,name:dto.name,year:dto.year,tier:dto.tier});
            if (defr.length > 0) {
                throw new BadRequestException("factor is already saved", "factor is already");
            }else{
                return this.repo.save(dto);

            }
        }catch(err){
          console.log(err);
          return null;
        }
      }

    constructor(@InjectRepository(Defra) repo,){super(repo)};

    async create(createFuelDto: Defra) {
     
       console.log(createFuelDto)

     
         return await this.repo.save(createFuelDto);
       }
 

       public async getDefraFac(year:number, tier:string , codes:any[]):Promise<any>{


        const factors = await this.repo.createQueryBuilder("defra")
        .where("defra.year = :year AND defra.tier = :tier AND defra.code IN (:...codes)" , 
        { year: year, tier: tier ,codes:codes})
    
        .getMany()
    
    
    
        let res = {};
        for await (const code of codes) {
            console.log("code",code)
           let factor = factors.find(f => f.code === code);            
           if(factor === undefined || factor === null){
               factor = await this.getLatusFactor(code,tier);            
           }
            res = factor;
        }
        console.log(res)
        return res;
    
    }
  
    async getLatusFactor(code: any, tier:string): Promise<any> {
      const factor = await this.repo.createQueryBuilder("defra")
      .where("defra.code = :code AND defra.tier = :tier"  , 
      { 
           code: code, tier: tier
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
