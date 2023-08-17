import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { fuelType } from '../enum/fuelType.enum';
import { ExcellUploadable } from '../services/excell-uploadale';
import { FuelPrice } from './fuel-price.entity';
import { FuelSpecific } from './fuel-specfic.entity';
import { Fuel } from './fuel.entity';

@Injectable()
export class FuelSpecificService extends TypeOrmCrudService<FuelSpecific> implements ExcellUploadable {

    constructor(@InjectRepository(FuelSpecific) repo,) { super(repo) };

    private excelBulkVariableMapping: { code: string, name: string }[] = [
        { code: "code", name: 'fuel code' },
        { code: "country", name: 'country' },
        { code: "year", name: "year" },
        { code: "ncv", name: "ncv" },
        { code: "density", name: "density" },
        { code: "unit_ncv", name: "unit ncv" },
        { code: "ncv", name: "ncv" },
        { code: "unit_density", name: "unit density" },
    ]



    downlodExcellBulkUploadVariableMapping() {

        return this.excelBulkVariableMapping;

    }

    async excellBulkUpload(data: any, variable_mapping: any[], year: number) {

        console.log("data", data)
        let dto = new FuelSpecific();

        // dto.year = year;

        this.excelBulkVariableMapping.forEach(vm => {
            if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
                dto[vm.code] = data[vm.name]
            }
        })
        console.log("dto", dto)


        try {

            let fuelspe = await this.repo.find({ code: dto.code, country: dto.country, year: dto.year });
            if (fuelspe.length > 0) {
                throw new BadRequestException("fuel-price is already saved", "fuel-price is already");
            }
            else {
                return this.repo.save(dto);

            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    public async getFuelSpecification(year: number, countryCode: string, codes: fuelType[]): Promise<any> {


        const factors = await this.repo.createQueryBuilder("fuelfac")
            .where("fuelfac.year = :year AND fuelfac.country = :countryCode AND fuelfac.code IN (:...codes)",
                { year: year, countryCode: countryCode, codes: codes })

            .getMany()


        let res = {};
        for await (const code of codes) {
            let factor = factors.find(f => f.code === code);
            if (factor === undefined || factor === null) {
                factor = await this.getLatusFactor(code, countryCode);
            }
            res = factor;
        }
        if (res === -1) {
            console.log("---------------start FuelSpecific------------------")
            console.log(year, countryCode, codes);
            console.log("FuelSpecific --- ", res);
            console.log("---------------end FuelSpecific------------------")
        }
        return res;

    }

    // TODO: should be filter by year
    async getLatusFactor(code: fuelType, countryCode: string): Promise<any> {
        const factor = await this.repo.createQueryBuilder("fuelfac")
            .where("fuelfac.country = :countryCode AND fuelfac.code = :code",
                {
                    countryCode: countryCode, code: code
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

    async create(createFuelPriceDto: FuelSpecific) {

        return await this.repo.save(createFuelPriceDto);
    }

}
