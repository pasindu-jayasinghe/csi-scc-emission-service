import { Injectable } from '@nestjs/common';
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
import { FuelBaseDto, OffroadMachineryDto } from './offroad-machinery.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class OffroadMachineryService implements Iso14064Service, GHGProtocolService  {

    public fuel;
    public fuelSpecific;
    public currencies = currencies

    constructor(
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificService: FuelSpecificService,
        private service: CommonEmissionFactorService
    ){}

    calculationGHGProtocol(data: OffroadMachineryDto) {
        return this.calculationIso14064(data);
    }
 
    async calculationIso14064(data: OffroadMachineryDto){

        if (data.fuelType === fuelType.PETROL){
            this.fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.offroad_machinery, data.baseData.sourceType, data.industry, data.baseData.tier,
                data.year, data.baseData.countryCode, [data.fuelType], {stroke: data.fuel.stroke}
                )
        } else {
            this.fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.offroad_machinery, data.baseData.sourceType, data.industry, data.baseData.tier,
                data.year, data.baseData.countryCode, [data.fuelType]
                )
        }
        this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuelType])
        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);
            
        let energy = 0;
        if (data.mode === TransportMode.fuel_base){
            energy = this.calculateFuelBase(data.fuel)
        }

        let response = new emissionCalResDto()
        response.e_sc_co2 = (this.fuel.co2_default * gwp_co2) / 1000 * energy;
        response.e_sc_ch4 = (this.fuel.ch4_default * gwp_ch4) / 1000 * energy;
        response.e_sc_n2o = (this.fuel.n20_default * gwp_n2o) / 1000 * energy;
        response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

        return response
    }

        calculateFuelBase(data: FuelBaseDto){
            let fc_unit = ParamterUnit.freight_offroad_fc;
            let fc_value = data.fc;
            
            let fc_dataUnit = data.fc_unit;
    
            if (this.currencies.includes(fc_dataUnit)){
                fc_value = fc_value / this.fuel.price
            } else {
                if (fc_dataUnit !== fc_unit){
                    fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit).value
                }
            }
    
    
            return (fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density
        }
}
