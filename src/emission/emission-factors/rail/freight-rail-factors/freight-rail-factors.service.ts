import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ExcellUploadable } from 'src/emission/services/excell-uploadale';
import { FreightRailFactors } from './freight-rail-factors.entity';

@Injectable()
export class FreightRailFactorsService extends TypeOrmCrudService<FreightRailFactors> implements ExcellUploadable {
    constructor(@InjectRepository(FreightRailFactors) repo,) { super(repo) };



    private excelBulkVariableMapping: { code: string, name: string }[] = [
        { code: "activity", name: 'fuel code' },
        { code: "type", name: 'country' },
        { code: "year", name: "year" },
        { code: "kgco2e", name: "kgco2e" },
        { code: "kgco2", name: "kgco2" },
        { code: "kgch4", name: "kgch4" },
        { code: "kgn2o", name: "kgn2o" },
        { code: "unit density", name: "unit density" },
    ]



    downlodExcellBulkUploadVariableMapping() {

        return this.excelBulkVariableMapping;

    }

    async excellBulkUpload(data: any, variable_mapping: any[], year: number) {

        console.log("data", data)
        let dto = new FreightRailFactors();

        // dto.year = year;

        this.excelBulkVariableMapping.forEach(vm => {
            if (data[vm.name] != undefined && data[vm.name] != null && data[vm.name] != '' ) {
                dto[vm.code] = data[vm.name]
            }
        })
        console.log("dto", dto)


        try {
            let railfac = await this.repo.find({ activity: dto.activity, type: dto.type, year: dto.year });
            if (railfac.length > 0) {
                throw new BadRequestException("factor is already saved", "factor is already");
            } else {
                return this.repo.save(dto);

            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    async create(createFuelDto: FreightRailFactors) {
        return await this.repo.save(createFuelDto);
    }

    public async getFreightRailFactors(year: number, activity: string, type: string): Promise<any> {
        const factors = await this.repo.createQueryBuilder("railFac")
            .where("railFac.year = :year AND railFac.activity = :activity AND railFac.type = :type",
                { year: year, activity: activity, type: type })

            .getMany()
        let res = {};
        let factor = factors.find(f => (f.activity === activity && f.type === type));
        if (factor === undefined || factor === null) {
            factor = await this.getLatusFactor(activity, type);
        }
        res = factor;
        console.log(res)
        return res;

    }
    async getLatusFactor(activity: string, type: string): Promise<any> {
        const factor = await this.repo.createQueryBuilder("railFac")
            .where("railFac.activity = :activity AND railFac.type = :type",
                { activity: activity, type: type })
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
