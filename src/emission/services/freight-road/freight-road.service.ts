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
import { DistanceBaseDto, FreightRoadDto, FuelBaseDto } from './freight-road.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class FreightRoadService implements Iso14064Service, GHGProtocolService {
    public fuel: any;
    public fuelSpecific
    public dist_ef: any;
    public currencies = currencies

    constructor(
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificService: FuelSpecificService,
        private fuelPriceService: FuelPriceService,
        private service: CommonEmissionFactorService
    ){}

    calculationGHGProtocol(data: FreightRoadDto) {
        return this.calculationIso14064(data);
    }

    async calculationIso14064(data: FreightRoadDto){

        console.log("data--",data)
        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);

        let response = new emissionCalResDto()
        let energy = 0;
        if (data.mode === TransportMode.fuel_base){
            // this.fuel = await this.fuelFactorService.getFuelFactors2(
            //     sourceName.freight_road, data.baseData.sourceType, data.baseData.industry, data.baseData.tier,
            //     data.year, data.baseData.countryCode, [data.fuel.fuelType]
            // )
            // this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuel.fuelType])
            energy = await this.calculateFuelBase(data.fuel, data.year, data.month, data.fuelType, data.baseData)
            energy = energy * (data.share / 100)
            response.e_sc_co2 = (this.fuel.co2_default * gwp_co2) / 1000 * energy;
            response.e_sc_ch4 = (this.fuel.ch4_default * gwp_ch4) / 1000 * energy;
            response.e_sc_n2o = (this.fuel.n20_default * gwp_n2o) / 1000 * energy;
            response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;
        } else if (data.mode === TransportMode.distance_base){  
            if (data.distance.fe !== undefined && data.distance.fe !== 0){
                let fe_unit = ParamterUnit.freight_road_fe
                let dist_unit = ParamterUnit.freight_road_distance
                if (data.distance.fe_unit !== fe_unit){
                    data.distance.fe = this.conversionService.convertUnit(data.distance.fe, data.distance.fe_unit, fe_unit).value
                } 
                if (data.distance.distanceUp_unit !== dist_unit){
                    data.distance.distanceUp = this.conversionService.convertUnit(data.distance.distanceUp, data.distance.distanceUp_unit, dist_unit).value
                } 
                let fuelBase = new FuelBaseDto()
                fuelBase.fc = (data.distance.distanceUp / data.distance.fe) * data.distance.trips
                fuelBase.fc_unit = ParamterUnit.freight_road_fc
                energy = await this.calculateFuelBase(fuelBase, data.year, data.month, data.fuelType, data.baseData)
                console.log("energy",energy)


                console.log("share",data.share )
                energy = energy * (data.share / 100)
                console.log("energy-1",energy)
                response.e_sc_co2 = ((this.fuel.co2_default * gwp_co2) / 1000) * energy;
                response.e_sc_ch4 = ((this.fuel.ch4_default * gwp_ch4) / 1000) * energy;
                response.e_sc_n2o = ((this.fuel.n20_default * gwp_n2o) / 1000) * energy;
                response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;
            } else {
                this.dist_ef = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors[data.distance.cargoType]])
                energy = await this.calculateDistanceBase(data.distance)
                energy = energy * (data.share / 100)
                response.e_sc = energy;
                response.e_sc_co2 = 0;
                response.e_sc_ch4 = 0;
                response.e_sc_n2o = 0;
            }   
        }

        console.log('eeeee',response.e_sc)

        return response
    }

    calculateFuelBaseMain(data: FuelBaseDto, year: number, month: number, baseData:BaseDataDto){

    }

     /**TODO Need to update getFuelFactors filter for get ef  */
    async calculateFuelBase(data: FuelBaseDto, year: number, month: number, fuelType: fuelType, baseData:BaseDataDto){

        console.log("fffff--",{
            year:year,
            sourceType:baseData.sourceType,
            in:baseData.industry,
            tier:baseData.tier,
            c: baseData.countryCode,
            fuelType:fuelType

        })
        this.fuel = await this.fuelFactorService.getFuelFactors2(
            sourceName.freight_road, baseData.sourceType, baseData.industry, baseData.tier,
            year, baseData.countryCode, [fuelType]
        )
        this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [fuelType])

        console.log(this.fuel, this.fuelSpecific)

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

     console.log('sss',(fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density)
        return (fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density
    }

    async calculateDistanceBase(data: DistanceBaseDto){
        let distance_unit = ParamterUnit.freight_road_distance;
        let weight_unit = ParamterUnit.freight_road_weight;

        let weight = 0;
        let distance = 0;

        let distanceUp_value = data.distanceUp;
        let weightUp_value = data.weightUp;
        let distanceUp_dataUnit = data.distanceUp_unit;
        let weightUp_dataUnit = data.weightUp_unit;

        if (currencies.includes(distanceUp_dataUnit)){
            distanceUp_value = data.distanceUp / data.costUp
        } else {
            if (distanceUp_dataUnit !== distance_unit){
                distanceUp_value = this.conversionService.convertUnit(distanceUp_value, distanceUp_dataUnit, distance_unit).value
            } 
        }


        if (weightUp_dataUnit !== weight_unit){
            weightUp_value = this.conversionService.convertUnit(weightUp_value, weightUp_dataUnit, weight_unit).value
        }

        if (data.twoWay){
            let distanceDown_value = data.distanceDown;
            let weightDown_value = data.weightDown;
            let distanceDown_dataUnit = data.distanceDown_unit;
            let weightDown_dataUnit = data.weightDown_unit;

            if (currencies.includes(distanceDown_dataUnit)){
                distanceDown_value = data.distanceDown / data.costDown
            }
            if (distanceDown_dataUnit !== distance_unit){
                distanceDown_value = this.conversionService.convertUnit(distanceDown_value, distanceDown_dataUnit, distance_unit).value
            } 
    
            if (weightDown_dataUnit !== weight_unit){
                weightDown_value = this.conversionService.convertUnit(weightDown_value, weightDown_dataUnit, weight_unit).value
            }
            distance = distanceUp_value  + distanceDown_value 
            weight = weightUp_value + weightDown_value;
        } else {
            distance = distanceUp_value 
            weight = weightUp_value

            console.log(distance, weight, this.dist_ef[emissionFactors[data.cargoType]], data.cargoType)
        }

        return weight *(distance)* data.trips * (this.dist_ef[emissionFactors[data.cargoType]]/1000000);
    }
}
