import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { GasBiomassFactor } from './gas-biomass-factor.entity';
import { gasBiomassFactors } from '../enum/gasBiomassFactors.enum';




@Injectable()
export class GasBiomassFactorService extends TypeOrmCrudService<GasBiomassFactor> {
    constructor(@InjectRepository(GasBiomassFactor) repo,){super(repo);}

    public async getGasBiomassFactors(year: number, countryCode: string, codes: gasBiomassFactors[]): Promise<any> {

        let factors = await this.repo.createQueryBuilder()
            .where("countryCode = :countryCode AND year = :year AND code IN (:...codes)",  { 
                countryCode: countryCode, year: year, codes: codes
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
        return res;
    }

    private async getLatusFactor(code: gasBiomassFactors, countryCode: string): Promise<number>{

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

}
