import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Incineration } from './incineration.entity';


@Injectable()
export class IncinerationService extends TypeOrmCrudService<Incineration>{

    constructor(@InjectRepository(Incineration) repo,){super(repo)};

    async create(createIncinerationDto: Incineration) {
         return await this.repo.save(createIncinerationDto);
       }
 

       public async getIncinerationFac(year:number , codes:any[]):Promise<any>{


        const factors = await this.repo.createQueryBuilder("incineration")
        .where("incineration.year = :year AND incineration.code IN (:...codes)" , 
        { year: year, codes:codes})
    
        .getMany()
    
    
    
        let res = {};
        for await (const code of codes) {
           let factor = factors.find(f => f.code === code);            
           if(factor === undefined || factor === null){
               factor = await this.getLatusFactor(code);            
           }
            res = factor;
        }
        return res;
    
    }
  
    async getLatusFactor(code: any): Promise<any> {
      const factor = await this.repo.createQueryBuilder("incineration")
      .where("incineration.code = :code"  , 
      { 
           code: code, 
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
