import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { currencies, distances, ParamterUnit, passengerDistances } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { DistanceBaseDto, FuelBaseDto, PassengerRailDto } from './passenger-rail.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class PassengerRailService implements Iso14064Service, GHGProtocolService {

    public fuel: any;
    public fuelSpecific: any;
    public fuelPrice: any;
    public gwp_co2 
    public gwp_ch4 
    public gwp_n2o
    public currencies = currencies
    public distUnits = distances
    public passengerUnits = passengerDistances

    constructor(
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificService: FuelSpecificService,
        private fuelPriceService: FuelPriceService,
        private service: CommonEmissionFactorService
    ){}

    calculationGHGProtocol(data: PassengerRailDto) {
        return this.calculationIso14064(data);
    }

    async calculationIso14064(data: PassengerRailDto){
        console.log(data)
        this.fuel = await this.fuelFactorService.getFuelFactors2(
            sourceName.passenger_rail, data.baseData.sourceType, data.baseData.industry, 
            data.baseData.tier, data.year, data.baseData.countryCode, [data.fuelType]
        )        
        this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year,  data.baseData.countryCode, [data.fuelType])       
        this.fuelPrice = await this.fuelPriceService.getFuelPrice(data.year, data.month, data.fuel.fc_unit, data.baseData.countryCode, [data.fuelType])

        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year,  data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);

        this.gwp_co2 = gwp_co2; this.gwp_ch4 = gwp_ch4; this.gwp_n2o = gwp_n2o

        let energy = 0
        let response = new emissionCalResDto()
        if (data.mode === TransportMode.fuel_base){
            energy = this.calculateFuelBase(data.fuel, data.fuelType)
            response.e_sc_co2 = (this.fuel.co2_default * gwp_co2) / 1000 * energy;
            response.e_sc_ch4 = (this.fuel.ch4_default * gwp_ch4) / 1000 * energy;
            response.e_sc_n2o = (this.fuel.n20_default * gwp_n2o) / 1000 * energy;
            response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;
        } else if (data.mode === TransportMode.distance_base){
            response = this.calculateDistanceBase(data.distance)
        }

        //ef from mobile combution
        return response;
    }

    calculateFuelBase(data: FuelBaseDto, type: fuelType){
        let fc_unit_vol = ParamterUnit.passenger_rail_fc_vol;
        let fc_unit_weight = ParamterUnit.passenger_rail_fc_weight
        let fc_value = data.fc;

        let fc_dataUnit = data.fc_unit

        if (type === fuelType.COAL || fc_dataUnit=== 'KG'){
            if (this.currencies.includes(fc_dataUnit)) {
                fc_value = fc_value / this.fuelPrice.price
            } else {
                if (fc_dataUnit !== fc_unit_weight) {
                    fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit_weight).value;
                }
            }
            return (fc_value / 1000) * this.fuelSpecific.ncv;
        } else {
            if (this.currencies.includes(fc_dataUnit)){
                fc_value = fc_value / this.fuelPrice.price
            } else {
                if (fc_dataUnit !== fc_unit_vol){
                    fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit_vol).value;
                }
            }
            return (fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density;
        }
    }

    calculateDistanceBase(data: DistanceBaseDto){
        let response = new emissionCalResDto()
        let distance_unit = ParamterUnit.passenger_rail_distance
        let distance_unit_passenger = ParamterUnit.passenger_rail_distance_passenger
        let fe_unit = ParamterUnit.passenger_rail_fe

        let dist_value = data.distance
        let fe_value = data.fe

        let dist_dataUnit = data.distance_unit
        let fe_dataUnit = data.fe_unit

        if (this.distUnits.includes(dist_dataUnit)){
            if (dist_dataUnit !== distance_unit){
                dist_value = this.conversionService.convertUnit(dist_value, dist_dataUnit, distance_unit).value
            }
            if (fe_dataUnit !== fe_unit){
                fe_value = this.conversionService.convertUnit(fe_value, fe_dataUnit, fe_unit).value
            }
            if (data.twoWay) dist_value = dist_value * 2

            let energy = (((dist_value / fe_value) * data.trips) / 1000) * this.fuelSpecific.density * this.fuelSpecific.ncv

            response.e_sc_co2 = (this.fuel.co2_default * this.gwp_co2) / 1000 * energy;
            response.e_sc_ch4 = (this.fuel.ch4_default * this.gwp_ch4) / 1000 * energy;
            response.e_sc_n2o = (this.fuel.n20_default * this.gwp_n2o) / 1000 * energy;
            response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

        } else if(this.passengerUnits.includes(dist_dataUnit)){
            if (dist_dataUnit !== distance_unit_passenger){
                dist_value = this.conversionService.convertUnit(dist_value, dist_dataUnit, distance_unit_passenger).value
                
            }
            if (data.twoWay) dist_value = dist_value * 2

            response.e_sc = ((dist_value*data.trips)*0.007976)/1000
            response.e_sc_ch4 = 0
            response.e_sc_co2 = 0
            response.e_sc_n2o = 0
        }
        

        return response
    }
}
