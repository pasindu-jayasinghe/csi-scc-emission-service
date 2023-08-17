import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelPriceService } from 'src/emission/emission-factors/fuel-price.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { TransportService } from 'src/emission/emission-factors/transport.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { currencies, ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { TransportMode } from 'src/emission/enum/transport.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { DBusinessTravelDto, DEmpCommutingDto, FBusinessTravelDto, FEmpCommutingDto, PassengerRoadDto } from './passenger-road.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class PassengerRoadService implements Iso14064Service, GHGProtocolService  {

    public gwp_co2: number;
    public gwp_ch4: number;
    public gwp_n2o: number;
    public currencies = currencies

    constructor(
        private service: CommonEmissionFactorService,
        private conversionService: UnitConversionService,
        private fuelFactorService: FuelFactorService,
        private fuelPriceService: FuelPriceService,
        private fuelSpecificService: FuelSpecificService,
        private transportFactorService: TransportService
    ) { }

    calculationGHGProtocol(data: PassengerRoadDto) {
        return this.calculationIso14064(data);
    }

    async calculationIso14064(data: PassengerRoadDto) {
        let energy = 0;
        let response = new emissionCalResDto()
        let { gwp_co2, gwp_ch4, gwp_n2o } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
            [
                emissionFactors.gwp_co2,
                emissionFactors.gwp_ch4,
                emissionFactors.gwp_n2o,
            ]);

        this.gwp_co2 = gwp_co2; this.gwp_ch4 = gwp_ch4; this.gwp_n2o = gwp_n2o;



        if (data.mode === TransportMode.fuel_base) {
            if (data.method === 'BT') {
                response = await this.calculateFuelBaseBT(data.fuel.businessTravel, data.year, data.month, data.baseData)
            } else {
                response = await this.calculateFuelBaseEC(data.fuel.empCommuting, data.year, data.baseData)
                console.log("ree",response)
            }
        } else if (data.mode === TransportMode.distance_base) {
            if (data.method === 'BT') {
                response = await this.calculateDistanceBaseBT(
                    data.distance.businessTravel,
                    data.distance.fe,
                    data.distance.fe_unit,
                    data.year,
                    data.month,
                    data.baseData)
            } else {
                response = await this.calculateDistanceBaseEC(
                    data.distance.empCommuting,
                    data.distance.fe,
                    data.distance.fe_unit,
                    data.year,
                    data.baseData
                )
            }
        }


        return response;

    }

    /* Buisness Travel Calculation*/

    async calculateFuelBaseBT(data: FBusinessTravelDto, year: number, month: number, baseData: BaseDataDto) {
        let fuel = await this.fuelFactorService.getFuelFactors2(
            sourceName.business_travel, baseData.sourceType, baseData.industry, 
            baseData.tier, year, baseData.countryCode, [data.fuelType]
        )
        let fuelSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [data.fuelType])
        
        let response = new emissionCalResDto()

        let unit = ParamterUnit.business_travel_fc
        let value = data.fc

        let dataUnit = data.fc_unit

        if (this.currencies.includes(dataUnit)) {
            let fuelPrice = await this.fuelPriceService.getFuelPrice(year, month, dataUnit, baseData.countryCode, [data.fuelType])
            value = value / fuelPrice.price 
        } else {
            if (dataUnit !== unit) {
                value = this.conversionService.convertUnit(value, dataUnit, unit).value
            }
        }

        // console.log(fuelSpecific);
        // console.log(fuel);


        let energy = ((value/1000) * data.trips) * fuelSpecific.density * fuelSpecific.ncv;
        response.e_sc_co2 = (fuel.co2_default * this.gwp_co2) / 1000 * energy;
        response.e_sc_ch4 = (fuel.ch4_default * this.gwp_ch4) / 1000 * energy;
        response.e_sc_n2o = (fuel.n20_default * this.gwp_n2o) / 1000 * energy;
        response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

        // console.log(response);
        return response
    }

    async calculateDistanceBaseBT(data: DBusinessTravelDto, fe: number, feUnit: string, year: number, month: number, baseData: BaseDataDto) {
        let fuel = await this.fuelFactorService.getFuelFactors2(
            sourceName.business_travel, baseData.sourceType, baseData.industry, 
            baseData.tier, year, baseData.countryCode, [data.fuelType]
        )
        let fuelSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [data.fuelType])
        let response = new emissionCalResDto()

        let distance_unit = ParamterUnit.business_travel_distance
        let fe_unit = ParamterUnit.business_travel_fe

        let distance_value = data.distance;
        let fe_value = fe;

        let distance_dataUnit = data.distance_unit;
        let fe_dataUnit = feUnit;

        if (this.currencies.includes(distance_dataUnit)) {
            distance_value = distance_value / data.cost
        } else {
            if (distance_dataUnit !== distance_unit) {
                distance_value = this.conversionService.convertUnit(distance_value, distance_dataUnit, distance_unit).value;
            }
        }

        if (fe_dataUnit !== fe_unit) {
            fe_value = this.conversionService.convertUnit(fe_value, fe_dataUnit, fe_unit).value;
        }

        if (data.twoWay) distance_value = distance_value * 2

        let energy = ((distance_value / fe_value) / 1000) * fuelSpecific.density * fuelSpecific.ncv;
        response.e_sc_co2 = (fuel.co2_default * this.gwp_co2) / 1000 * energy;
        response.e_sc_ch4 = (fuel.ch4_default * this.gwp_ch4) / 1000 * energy;
        response.e_sc_n2o = (fuel.n20_default * this.gwp_n2o) / 1000 * energy;
        response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

        return response
    }

    /* Employee Commuting calculation */

    async calculateFuelBaseEC(data: FEmpCommutingDto, year: number, baseData: BaseDataDto) {

        console.log("ff",data)
        let response = new emissionCalResDto()
        let co2 = 0; let ch4 = 0; let n2o = 0; let total = 0;
        if (data.petrolConsumption) {
            let petrolEF = await this.fuelFactorService.getFuelFactors2(
                sourceName.passenger_road, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [fuelType.PETROL]
            )
            console.log("petrolEF",petrolEF)

            let petrolSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [fuelType.PETROL])
            console.log("petrolSpecific",petrolSpecific)

            let unit = ParamterUnit.passenger_road_fc
            let value = data.petrolConsumption * data.workingDays

            let dataUnit = data.petrolConsumption_unit

            if (dataUnit !== unit){
                value = this.conversionService.convertUnit(value, dataUnit, unit).value
            }

            let energy = (value / 1000) * petrolSpecific.density * petrolSpecific.ncv

            if(petrolEF){

                if(petrolEF.co2_default){
                    co2 += (petrolEF.co2_default * this.gwp_co2) / 1000 * energy;
                }
                if(petrolEF.ch4_default){
                    ch4 += (petrolEF.ch4_default * this.gwp_ch4) / 1000 * energy;
                }
                if(petrolEF.n20_default){
                    n2o += (petrolEF.n20_default * this.gwp_n2o) / 1000 * energy;
                }

            }
        
        } 


        if (data.dieselConsumption) {
            let dieselEF = await this.fuelFactorService.getFuelFactors2(
                sourceName.passenger_road, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [fuelType.DIESEL]
            )
            let dieselSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [fuelType.DIESEL])

            let unit = ParamterUnit.passenger_road_fc
            let value = data.dieselConsumption * data.workingDays

            let dataUnit = data.dieselConsumption_unit

            if (dataUnit !== unit){
                value = this.conversionService.convertUnit(value, dataUnit, unit).value
            }

            let energy = (value / 1000) * dieselSpecific.density * dieselSpecific.ncv

            if(dieselEF){
                if(dieselEF.co2_default){
                    co2 += (dieselEF.co2_default * this.gwp_co2) / 1000 * energy;
                }
                if(dieselEF.ch4_default){
                    ch4 += (dieselEF.ch4_default * this.gwp_ch4) / 1000 * energy;
                }
                if(dieselEF.n20_default){
                    n2o += (dieselEF.n20_default * this.gwp_n2o) / 1000 * energy;
                }
            }
        }



        response.e_sc_co2 = co2;
        response.e_sc_ch4 = ch4;
        response.e_sc_n2o = n2o;
        response.e_sc = response.e_sc_co2 + response. e_sc_ch4 + response.e_sc_n2o

        return response;
    }

    async calculateDistanceBaseEC(data: DEmpCommutingDto, fe: number, feUnit: string, year: number, baseData: BaseDataDto) {
        console.log(data)
        let response = new emissionCalResDto()
        response.e_sc_co2 = 0
        response.e_sc_ch4 = 0
        response.e_sc_n2o = 0
        response.e_sc = 0
        
        if (data.privateDistance && data.privateDistance > 0) {
            let fuel = await this.fuelFactorService.getFuelFactors2(
                sourceName.passenger_road, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [data.fuelType]
            )
            let fuelSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [data.fuelType])

            let dist_unit = ParamterUnit.passenger_road_distance
            let fe_unit = ParamterUnit.passenger_road_fe

            let dist = data.privateDistance

            let dist_dataUnit = data.privateDistance_unit
            
            if (dist_dataUnit !== dist_unit){
                dist = this.conversionService.convertUnit(dist, dist_dataUnit, dist_unit).value
            }
            if (feUnit !== fe_unit) {
                fe = this.conversionService.convertUnit(fe, feUnit, fe_unit).value
            }

            let energy = ((dist / fe) * data.workingDays) / 1000 * fuelSpecific.density * fuelSpecific.ncv

            // console.log("fuel ---------",fuel)
            if(fuel){
                response.e_sc_co2 += fuel.co2_default?(fuel.co2_default * this.gwp_co2) / 1000 * energy: response.e_sc_co2;
                response.e_sc_ch4 += fuel.ch4_default? (fuel.ch4_default * this.gwp_ch4) / 1000 * energy: response.e_sc_ch4;
                response.e_sc_n2o += fuel.n20_default ? (fuel.n20_default * this.gwp_n2o) / 1000 * energy: response.e_sc_n2o;
            }

        }

        if (data.hiredDistance && data.hiredDistance > 0) {
            let fuel = await this.fuelFactorService.getFuelFactors2( 
                sourceName.passenger_road, baseData.sourceType, baseData.industry, baseData.tier,
                year, baseData.countryCode, [data.hiredfuelType]
            )
            let fuelSpecific = await this.fuelSpecificService.getFuelSpecification(year, baseData.countryCode, [data.hiredfuelType])

            let dist_unit = ParamterUnit.passenger_road_distance
            let fe_unit = ParamterUnit.passenger_road_fe

            let dist = data.hiredDistance
            let hfe = data.hiredfe

            let dist_dataUnit = data.hiredDistance_unit
            
            if (dist_dataUnit !== dist_unit){
                dist = this.conversionService.convertUnit(dist, dist_dataUnit, dist_unit).value
            }
            if (data.hiredfe_unit !== fe_unit) {
                hfe = this.conversionService.convertUnit(hfe, data.hiredfe_unit, fe_unit).value
            }

            let energy = ((dist / hfe) * data.workingDays) / 1000 * fuelSpecific.density * fuelSpecific.ncv
            console.log(fuel)

            // console.log("fuel ---------",fuel)
            if(fuel){
                response.e_sc_co2 += fuel.co2_default?(fuel.co2_default * this.gwp_co2) / 1000 * energy: response.e_sc_co2;
                response.e_sc_ch4 += fuel.ch4_default? (fuel.ch4_default * this.gwp_ch4) / 1000 * energy: response.e_sc_ch4;
                response.e_sc_n2o += fuel.n20_default ? (fuel.n20_default * this.gwp_n2o) / 1000 * energy: response.e_sc_n2o;
            }

            console.log(response)

        }

        // console.log('response', response)

        if (data.publicDistance && data.publicDistance > 0) {

            let ef: any
            let unit = ParamterUnit.passenger_road_distance_public

            let dist = data.publicDistance
            let dataUnit = data.publicDistance_unit

            if (dataUnit !== unit){
                dist = this.conversionService.convertUnit(dist, dataUnit, unit).value
            }

            ef = await this.transportFactorService.getTransFac(data.publicMode)

            if(ef){
                response.e_sc += ((dist * data.workingDays) * ef.kgco2ePKm) / 1000
            }else{
                response.e_sc += 0;
            }

        }

        let e =response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o
        console.log(e)
        if(e){
            response.e_sc += e;
        }

        // console.log('response 2', response)


        return response
    }
}
