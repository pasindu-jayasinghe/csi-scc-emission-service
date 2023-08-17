import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { FreightRailFactorsService } from 'src/emission/emission-factors/rail/freight-rail-factors/freight-rail-factors.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { currencies, ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { DistanceBasedDto, FreightRailDto, FuelBaseDto } from './freight-rail.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class FreightRailService implements Iso14064Service, GHGProtocolService  {

    public fuel: any;
    public fuelSpecific: any;
    public currencies = currencies

    constructor(
        private service: CommonEmissionFactorService,
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificService: FuelSpecificService,
        private fuelPriceService: FuelPriceService,
        private freightRailFacService: FreightRailFactorsService
    ){}

    calculationGHGProtocol(data: FreightRailDto) {
        return this.calculationIso14064(data);
    }

    /**TODO Need to update getFuelFactors filter for get ef  */
    async calculationIso14064(data: FreightRailDto){
        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);

           

        let energy = 0
        let response = new emissionCalResDto()
        if (data.mode === TransportMode.fuel_base){
            this.fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_rail, data.baseData.sourceType, data.baseData.industry, data.baseData.tier,
                data.year, data.baseData.countryCode, [data.fuel.fuelType]
                );
            this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuel.fuelType])

            energy = await this.calculateFuelBase(data.fuel, data.fuel.fuelType, data.baseData, data.year, data.month)
            response.e_sc_co2 = (this.fuel.co2_default * gwp_co2) / 1000 * energy;
            response.e_sc_ch4 = (this.fuel.ch4_default * gwp_ch4) / 1000 * energy;
            response.e_sc_n2o = (this.fuel.n20_default * gwp_n2o) / 1000 * energy;
            response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;
        } else {
            let energy = await this.calculateDistanceBase(data.distance, data.year)
            response.e_sc_co2 = energy.co2;
            response.e_sc_ch4 = energy.ch4;
            response.e_sc_n2o = energy.n2o;
            response.e_sc = energy.co2 + energy.ch4 + energy.n2o;
        }
        return response;
    }

    async calculateFuelBase(data: FuelBaseDto, type: fuelType, baseData: BaseDataDto, year: number, month: number){
        let fc_unit_vol = ParamterUnit.freight_rail_fc;
        let fc_unit_weight = ParamterUnit.freight_rail_weight
        let fc_value = data.fc;

        let fc_dataUnit = data.fc_unit

        if (type === fuelType.COAL){
            if (this.currencies.includes(fc_dataUnit)) {
                let fuelPrice = await this.fuelPriceService.getFuelPrice(year, month, fc_dataUnit, baseData.countryCode, [type])

            fc_value = fc_value / fuelPrice.price
            } else {
                if (fc_dataUnit !== fc_unit_weight) {
                    fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit_weight).value;
                }
            }
            return (fc_value / 1000) * this.fuelSpecific.ncv;
        } else {

            if (this.currencies.includes(fc_dataUnit)) {
                let fuelPrice = await this.fuelPriceService.getFuelPrice(year, month, fc_dataUnit, baseData.countryCode, [type])
                fc_value = fc_value / fuelPrice.price
            } else {
                if (fc_dataUnit !== fc_unit_vol){
                    fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit_vol).value;

                }
            }

            return (fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density;
        }

    }

    async calculateDistanceBase(data: DistanceBasedDto, year: number){
        
        let ef = await this.freightRailFacService.getFreightRailFactors(year, data.activity, data.type)
        let ef_co2 =  ef.kgco2
        let ef_ch4 = ef.kgch4
        let ef_n2o = ef.kgn2o
       

        let energy = 0

        let dist_unit = ParamterUnit.freight_rail_dist
        let weight_unit = ParamterUnit.freight_rail_dist_weight

        let distanceUp = data.distanceUp
        let weightUp = data.weightUp

        let distanceUp_unit = data.distanceUp_unit
        let weightUp_unit = data.weightUp_unit

        if (distanceUp_unit !== dist_unit) {
            distanceUp = this.conversionService.convertUnit(distanceUp, distanceUp_unit, dist_unit).value;
        }
        if (weightUp_unit !== weight_unit) {
            weightUp = this.conversionService.convertUnit(weightUp, weightUp_unit, weight_unit).value;
        }

        energy += distanceUp * weightUp * data.trips

        if (data.twoWay){
            let distanceDown = data.distanceDown
            let weightDown = data.weightDown
    
            let distanceDown_unit = data.distanceDown_unit
            let weightDown_unit = data.weightDown_unit
    
            if (distanceDown_unit !== dist_unit) {
                distanceDown = this.conversionService.convertUnit(distanceDown, distanceDown_unit, dist_unit).value;
            }
            if (weightDown_unit !== weight_unit) {
                weightDown = this.conversionService.convertUnit(weightDown, weightDown_unit, weight_unit).value;
            }

            energy += distanceDown * weightDown * data.trips
        } 

        return {
            co2: energy * ef_co2 / 1000,
            ch4: energy * ef_ch4 / 1000,
            n2o: energy * ef_n2o / 1000
        }
    }
}
