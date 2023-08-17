import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { FreightWaterFacService } from 'src/emission/emission-factors/freight-w-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { DistanceBaseDto, FreightWaterDto, FuelBaseDto } from './freight-water.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class FreightWaterService implements Iso14064Service, GHGProtocolService {

    efSea;

    constructor(
        private fuelFactorService: FuelFactorService,
        private conversionService: UnitConversionService,
        private freightWaterFactorService: FreightWaterFacService
    ){}

    calculationGHGProtocol(data: FreightWaterDto) {
        return this.calculationIso14064(data);
    }

    async calculationIso14064(data: FreightWaterDto){

        console.log('data',data)
        let response = new emissionCalResDto()
        if (data.mode === TransportMode.fuel_base){
            let ef = await this.calculateFuelBase(data.fuel, data.year, data.baseData)
            response.e_sc =  ef.co2 + ef.ch4 + ef.n2o
            response.e_sc_co2 = ef.co2
            response.e_sc_ch4 = ef.ch4
            response.e_sc_n2o = ef.n2o
        } else if (data.mode === TransportMode.distance_base){
            response.e_sc = await this.calculateDistanceBase(data.distance, data.year)
            response.e_sc_co2 = 0
            response.e_sc_ch4 = 0
            response.e_sc_n2o = 0
        }

        return response
    }

    async calculateFuelBase(data: FuelBaseDto, year: number, baseData: BaseDataDto){
        let dataUnit = data.fc_unit
        let fuel: any;
        let ef = {co2: 0, ch4: 0, n2o: 0};
        if (dataUnit === ParamterUnit.freight_water_fc_t){
            fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_water, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [data.fuel_type], {parameter_unit: ParamterUnit.freight_water_fc_t}
            )
            ef.co2 = fuel.co2_default
            ef.ch4 = fuel.ch4_default
            ef.n2o = fuel.n20_default
        } else if (dataUnit === ParamterUnit.freight_water_fc_l){
            fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_water, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [data.fuel_type], {parameter_unit: ParamterUnit.freight_water_fc_l}
            )
            ef.co2 = fuel.co2_default
            ef.ch4 = fuel.ch4_default
            ef.n2o = fuel.n20_default
        } else if (dataUnit === ParamterUnit.freight_water_fc_net){
            fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_water, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [data.fuel_type], {parameter_unit: ParamterUnit.freight_water_fc_net}
            )
            ef.co2 = fuel.co2_default
            ef.ch4 = fuel.ch4_default
            ef.n2o = fuel.n20_default
        } else if (dataUnit ===  ParamterUnit.freight_water_fc_gross){
            fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.freight_water, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [data.fuel_type], {parameter_unit: ParamterUnit.freight_water_fc_gross}
            )
            ef.co2 = fuel.co2_default
            ef.ch4 = fuel.ch4_default
            ef.n2o = fuel.n20_default
        }   

        ef.co2 = (data.fc * ef.co2)/1000
        ef.ch4 = (data.fc * ef.ch4)/1000
        ef.n2o = (data.fc * ef.n2o)/1000
        return ef

    }

    async calculateDistanceBase(data: DistanceBaseDto, year: number){
        let distance_unit = ParamterUnit.freight_water_distance;
        let weight_unit = ParamterUnit.freight_water_weight;

        let weight = 0;
        let distance = 0;

        let distanceUp_value = data.distanceUp;
        let weightUp_value = data.weightUp;
        let distanceUp_dataUnit = data.distanceUp_unit;
        let weightUp_dataUnit = data.weightUp_unit;

        if (distanceUp_dataUnit !== distance_unit){
            distanceUp_value = this.conversionService.convertUnit(distanceUp_value, distanceUp_dataUnit, distance_unit).value
        } 

        if (weightUp_dataUnit !== weight_unit){
            weightUp_value = this.conversionService.convertUnit(weightUp_value, weightUp_dataUnit, weight_unit).value
        }

        if (data.twoWay){
            let distanceDown_value = data.distanceDown;
            let weightDown_value = data.weightDown;
            let distanceDown_dataUnit = data.distanceDown_unit;
            let weightDown_dataUnit = data.weightDown_unit;

            if (distanceDown_dataUnit !== distance_unit){
                distanceDown_value = this.conversionService.convertUnit(distanceDown_value, distanceDown_dataUnit, distance_unit).value
            } 
    
            if (weightDown_dataUnit !== weight_unit){
                weightDown_value = this.conversionService.convertUnit(weightDown_value, weightDown_dataUnit, weight_unit).value
            }
            distance = distanceUp_value  + distanceDown_value 
            weight = weightUp_value + weightDown_value 
        } else {
            distance =  distanceUp_value
            weight =  weightUp_value 
        }

        this.efSea = (await this.freightWaterFactorService.getFreightWFac(year, data.activity, data.type, data.size)).kgco2e

        return (weight * distance * data.trips * this.efSea) / 1000;
    }
}
