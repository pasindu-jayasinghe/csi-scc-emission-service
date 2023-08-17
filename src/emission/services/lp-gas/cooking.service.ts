import { Injectable } from '@nestjs/common';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { cookingDto } from './cooking.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class CookingService implements Iso14064Service, GHGProtocolService  {

    public fuelSpecific: any;

    constructor(
        private service: CommonEmissionFactorService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecifcService: FuelSpecificService,
        private conversionService: UnitConversionService
    ) { }

    calculationGHGProtocol(data: any) {
        throw new Error('Method not implemented.');
    }


    async calculationIso14064(data: cookingDto) {

        let tedge: number;
        let edg: number;

        let w_unit = "";
        let value = data.w

        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);


        let fuel =  await this.fuelFactorService.getFuelFactors2(
            sourceName.cooking_gas, data.baseData.sourceType, data.baseData.industry, data.baseData.tier,
            data.year, data.baseData.countryCode, [data.fuelType]
        )
        this.fuelSpecific = await this.fuelSpecifcService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuelType])

        console.log("fuel---", fuel)

        let dataUnit = JSON.parse(data.w_unit)

        if (dataUnit.code !== w_unit){
            value = this.conversionService.convertUnit(value, dataUnit.code, w_unit).value
        }

        tedge = value / 1000 * this.fuelSpecific.ncv;

        edg = ((fuel.efco2 * gwp_co2) / 1000 * tedge) + (((fuel.efch4 * gwp_ch4) / 1000) * tedge) + ((fuel.efn2o * gwp_n2o) / 1000 * tedge)

        return edg;


    }






}
