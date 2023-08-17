import { Injectable, InternalServerErrorException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RecordStatus } from 'src/shared/entities/base.tracking.entity';
import { ConditionalFuelListReqDto } from '../dto/conditional-fuel-list-req.dto';
import { fuelType } from '../enum/fuelType.enum';
import { ExcellUploadable } from '../services/excell-uploadale';
import { FuelFactor } from './fuel-factor.entity';

@Injectable()
export class FuelFactorService extends TypeOrmCrudService<FuelFactor> implements ExcellUploadable {


    private excelBulkVariableMapping: { code: string, name: string }[] = [
        { code: "name", name: 'fuel code' },
        { code: "emsource", name: 'emission source' },
        { code: "stroke", name: "stroke" },
        { code: "unit", name: "unit" },
        { code: "source", name: "source" },
        { code: "industry", name: "industry" },
        { code: "tier", name: "tier" },
        { code: "countryCode", name: "country code" },
        { code: "consumptionUnit", name: "consumption unit" },
        { code: "ch4_default", name: "ch4_default" },
        { code: "ch4__upper", name: "ch4__upper" },
        { code: "ch4_lower", name: "ch4_lower" },
        { code: "n20_default", name: "n20_default" },
        { code: "n20__upper", name: "n20__upper" },
        { code: "n20_lower", name: "n20_lower" },
        { code: "co2_default", name: "co2_default" },
        { code: "co2__upper", name: "co2__upper" },
        { code: "co2_lower", name: "co2_lower" },
        { code: "reference", name: "reference" },
        { code: "year", name: "year" },


    ]

    constructor(@InjectRepository(FuelFactor) repo,) { super(repo) };


    downlodExcellBulkUploadVariableMapping() {

        return this.excelBulkVariableMapping;

    }

    async excellBulkUpload(data: any, variable_mapping: any[], year: number) {

        let dto = new FuelFactor();

  let vmcode;
        this.excelBulkVariableMapping.forEach(vm => {
            if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
                dto[vm.code] = data[vm.name]
               
                

        }
        })
        // console.log("dto", vmcode)


        try {
            let fuelfac = await this.repo.find({ code: dto.code, emsource: dto.emsource, stroke: dto.stroke,
                 unit: dto.unit, source: dto.source, industry: dto.industry, tier: dto.tier, countryCode: dto.countryCode ,year:dto.year});
            if (fuelfac.length > 0) {
                throw new BadRequestException("fuel-fac is already saved", "fuel-fac is already");
                
            }
            else {

                if(dto.ch4_default == undefined || dto.ch4__upper == undefined ||dto.ch4_lower == undefined || dto.co2__upper == undefined || dto.co2_default == undefined ||dto.co2_lower == undefined ||dto.n20__upper == undefined || dto.n20_lower == undefined ||dto.n20_default)
              {
                // console.log("ccccc",vmcode)
              }
                return this.repo.save(dto);

            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }


    public async getFuelFactors2(emsource: string, source: string, industry: string, tier: string,
        year: number, countryCode: string, codes: fuelType[], optional?: { parameter_unit?: String, stroke?: string }): Promise<any> {


        // console.log("opp",optional)
        let filter = this.createFilter(optional, source, year)
        // console.log(filter);
        // console.log(
        //     { 
        //         emsource: emsource, 
        //         source: source, 
        //         industry: industry,
        //         tier: tier, 
        //         year: year, 
        //         countryCode: countryCode, 
        //         codes: codes, 
        //         parameter_unit: optional?.parameter_unit, 
        //         stroke: optional?.stroke }
        // )



        const data = this.repo.createQueryBuilder("fuelfac")
            .where(filter,
                { emsource: emsource, source: source, industry: industry, tier: tier, year: year, countryCode: countryCode, codes: codes, parameter_unit: optional?.parameter_unit, stroke: optional?.stroke })

        //    .getMany()
        let factors = await data.getMany()

        let res = {};
        for await (const code of codes) {
            let factor = factors.find(f => f.code.toUpperCase() === code.toUpperCase());
            if (factor === undefined || factor === null) {
                let optional_paras: { parameter_unit?: String, stroke?: string } = {};
                if (optional && optional.parameter_unit) optional_paras.parameter_unit = optional.parameter_unit
                if (optional && optional.stroke) optional_paras.stroke = optional.stroke
                factor = await this.getLatusFactor(year, emsource, source, industry, tier, countryCode, code, optional_paras);
            }
            res = factor;
        }

        // console.log("getFuelFactors2 -- ", res);
        if (res === -1) {
            console.log("---------------start getFuelFactors2------------------")
            console.log(emsource, source, year, industry, countryCode, tier, codes);
            console.log("getFuelFactors2 --- ", res);
            console.log("----------------end getFuelFactors2-----------------")
        }
        // console.log("getFuelFactors2 ",factors.getQuery())
        return res;

    }

    // TODO: filter less than year
    async getLatusFactor(year: number, emsource: string, source: string, industry: string, tier: string,
        countryCode: string, code: fuelType, optional?: { parameter_unit?: String, stroke?: string }): Promise<any> {
        let filter = this.createFilter(optional, source)
        filter = `${filter} AND fuelfac.year <:year`;
        const factor = await this.repo.createQueryBuilder("fuelfac")
            .where(filter,
                {
                    emsource: emsource,
                    source: source, 
                    industry: industry, 
                    tier: tier, 
                    countryCode: countryCode, 
                    code: code, 
                    parameter_unit: optional?.parameter_unit, 
                    stroke: optional?.stroke,
                    year: year
                })
            .orderBy('year', 'DESC')
            .limit(100)
            .getMany();
        if (factor && factor.length > 0) {
            return factor[0]
        } else {
            return -1; // TODO: 
        }

    }

    createFilter(optional: { parameter_unit?: String, stroke?: string }, source: string, year?: number) {



        let filter: string = "fuelfac.emsource = :emsource AND fuelfac.source = :source AND fuelfac.tier = :tier AND fuelfac.countryCode = :countryCode ";

        if (source === "S") {

            if (filter) {
                filter = `${filter} AND fuelfac.industry = :industry`;
            } else {
                filter = filter;
            }

        }

        if (year) {
            if (filter) {
                filter = `${filter} AND fuelfac.year = :year AND fuelfac.code IN (:...codes)`;
            } else {
                filter = filter;
            }
        } else {
            if (filter) {
                filter = `${filter} AND fuelfac.code = :code`;
            } else {
                filter = filter;
            }
        }

        if (optional && optional.parameter_unit) {
            if (filter) {
                filter = `${filter} AND fuelfac.consumptionUnit = :parameter_unit`;
            } else {
                filter = filter;
            }
        }

        if (optional && optional.stroke) {
            if (filter) {
                filter = `${filter} AND fuelfac.stroke = :stroke`;
            } else {
                filter = filter;
            }
        }
        return filter
    }

    async create(createFuelFacDto: FuelFactor) {

        if (!createFuelFacDto.stroke) {
            createFuelFacDto.stroke = ""
        }
        if (!createFuelFacDto.unit) {
            createFuelFacDto.unit = ""
        }
        console.log(createFuelFacDto)
        return await this.repo.save(createFuelFacDto);
    }


    async conditionalFuelListReq(req: ConditionalFuelListReqDto) {
        try{
            let factors = await this.repo.createQueryBuilder("fuelfac")
            .where('status =:status AND emsource =:emsource AND countryCode = :countryCode AND year =:year', {
                status: RecordStatus.Active,
                emsource: req.es.toString(),
                countryCode: req.countryCode,
                year: req.year
            })
            .getMany()

            let factors2 =  await this.repo.createQueryBuilder("fuelfac")
                    .where('status =:status AND emsource =:emsource AND countryCode = :countryCode AND year <:year', {
                        status: RecordStatus.Active,
                        emsource: req.es.toString(),
                        countryCode: req.countryCode,
                        year: req.year
                    })                    
                    .orderBy('year', 'DESC')
                    .limit(100)
                    .getMany()

            factors = [...factors,...factors2];

            console.log(factors.map(item => item));
            const unique = [...new Set(factors.map(item => item.code))];
            return unique;
        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }

}



