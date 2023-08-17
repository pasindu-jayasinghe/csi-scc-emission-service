import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { currencies, ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { FreightOffroadDto, FuelBaseDto } from './freight-offroad.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class FreightOffroadService implements Iso14064Service, GHGProtocolService  {

    public fuel;
    public fuelSpecific;
    public currencies = currencies

    constructor(
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificServise: FuelSpecificService,
        private fuelPriceService: FuelPriceService,
        private service: CommonEmissionFactorService
    ){}

    calculationGHGProtocol(data: FreightOffroadDto) {
        return this.calculationIso14064(data);
    }
 
    async calculationIso14064(data: FreightOffroadDto){

        if (data.fuel.fuelType === fuelType.PETROL){
            this.fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_offroad, data.baseData.sourceType, data.industry, data.baseData.tier,
                data.year, data.baseData.countryCode, [data.fuel.fuelType], {stroke: data.fuel.stroke});
        } else {
            this.fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_offroad, data.baseData.sourceType, data.industry, data.baseData.tier,
                data.year, data.baseData.countryCode, [data.fuel.fuelType]);
        }
        this.fuelSpecific = await this.fuelSpecificServise.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuel.fuelType]);
        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);
            
        let energy = 0;
        if (data.mode === TransportMode.fuel_base){
            energy = await this.calculateFuelBase(data.fuel, data.year, data.month, data.baseData, data.fuel.fuelType)
        }

        let response = new emissionCalResDto()
        response.e_sc_co2 = (this.fuel.co2_default * gwp_co2) / 1000 * energy;
        response.e_sc_ch4 = (this.fuel.ch4_default * gwp_ch4) / 1000 * energy;
        response.e_sc_n2o = (this.fuel.n20_default * gwp_n2o) / 1000 * energy;
        response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

        return response
    }

    async calculateFuelBase(data: FuelBaseDto, year: number, month: number, baseData: BaseDataDto, fuelType: fuelType){
        let fc_unit = ParamterUnit.freight_offroad_fc;
        let fc_value = data.fc;
        
        let fc_dataUnit = data.fc_unit;

        if (this.currencies.includes(fc_dataUnit)){
            let fuelPrice = await this.fuelPriceService.getFuelPrice(year, month, fc_dataUnit, baseData.countryCode, [fuelType])
            fc_value = fc_value / fuelPrice.price
        } else {
            if (fc_dataUnit !== fc_unit){
                fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit).value
            }
        }


        return (fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density
    }
}
