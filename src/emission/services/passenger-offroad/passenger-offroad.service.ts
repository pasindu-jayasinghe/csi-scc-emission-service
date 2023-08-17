import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { currencies, ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { DistanceBaseDto, FuelBaseDto, PassengerOffroadDto } from './passenger-offroad.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class PassengerOffroadService implements Iso14064Service, GHGProtocolService  {

    public fuel: any
    public fuelSpecific: any;
    public fuelPrice: any;
    public currencies = currencies

    constructor(
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelSpecificService: FuelSpecificService,
        private fuelPriceService: FuelPriceService,
        private service: CommonEmissionFactorService
    ){}

    calculationGHGProtocol(data: PassengerOffroadDto) {
        return this.calculationIso14064(data);
    }

    async calculationIso14064(data: PassengerOffroadDto){
        this.fuel = await this.fuelFactorService.getFuelFactors2(
            sourceName.passenger_offroad, data.baseData.sourceType, data.industry, 
            data.baseData.tier, data.year, data.baseData.countryCode, [data.fuelType], {stroke: data.fuel.stroke}
        )
        this.fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuelType])
        this.fuelPrice = await this.fuelPriceService.getFuelPrice(data.year, data.month, data.fuel.fc_unit, data.baseData.countryCode, [data.fuelType])
        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);
            
        let energy = 0;
        if (data.mode === TransportMode.fuel_base){
            energy = this.calculateFuelBase(data.fuel)
        } else if (data.mode === TransportMode.distance_base){
            energy = this.calculateDistanceBase(data.distance)
        }

        let response = new emissionCalResDto()
        response.e_sc_co2 = (this.fuel.co2_default * gwp_co2) / 1000 * energy;
        response.e_sc_ch4 = (this.fuel.ch4_default * gwp_ch4) / 1000 * energy;
        response.e_sc_n2o = (this.fuel.n20_default * gwp_n2o) / 1000 * energy;
        response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

        console.log(response)

        return response
    }

    calculateFuelBase(data: FuelBaseDto){
        let fc_unit = ParamterUnit.passenger_offroad_fc;
        let fc_value = data.fc;
        
        let fc_dataUnit = data.fc_unit;

        if (this.currencies.includes(fc_dataUnit)){
            fc_value = fc_value / this.fuelPrice.price
        } else {
            if (fc_dataUnit !== fc_unit){
                fc_value = this.conversionService.convertUnit(fc_value, fc_dataUnit, fc_unit).value
            }
        }


        return (fc_value / 1000) * this.fuelSpecific.ncv * this.fuelSpecific.density
    }

    calculateDistanceBase(data: DistanceBaseDto){

        let distance_unit = ParamterUnit.passenger_offroad_distance
        let fe_unit = ParamterUnit.passenger_offroad_fe

        let dist_value = data.distance
        let fe_value = data.fe

        let distance_dataUnit = data.distance_unit
        let fe_dataUnit = data.fe_unit

        if (distance_dataUnit !== distance_unit){
            dist_value = this.conversionService.convertUnit(dist_value, distance_dataUnit, distance_unit).value
        }

        if (fe_dataUnit !== fe_unit){
            fe_value = this.conversionService.convertUnit(fe_value, fe_dataUnit, fe_unit).value
        }

        if (data.twoWay) dist_value = dist_value * 2

        return (((dist_value / fe_value) * data.trips) / 1000) * this.fuelSpecific.density * this.fuelSpecific.ncv
    }
}
