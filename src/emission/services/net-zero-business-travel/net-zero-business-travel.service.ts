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
import {
  FuelFuelBasedNetZeroBusinessTravelEmissionSourceData,
  GridFuelBasedNetZeroBusinessTravelEmissionSourceData,
  NetZeroBusinessTravelDto,
  NetZeroBusinessTravelEmissionSourceDataTypeNames,
  RefrigerantFuelBasedNetZeroBusinessTravelEmissionSourceData,
} from './net-zero-business-travel.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';
import { NetZeroBusinessTravelMethod } from 'src/emission/enum/netZeroBusinessTravelMethod.enum';
import {
  DBusinessTravelDto,
  FEmpCommutingDto,
  DEmpCommutingDto,
} from '../passenger-road/passenger-road.dto';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';

@Injectable()
export class NetZeroBusinessTravelService
  implements Iso14064Service, GHGProtocolService
{
  public gwp_co2: number;
  public gwp_ch4: number;
  public gwp_n2o: number;
  public currencies = currencies;

  constructor(
    private netZeroFactorService: NetZeroFactorService,
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService,
    private fuelFactorService: FuelFactorService,
    private fuelPriceService: FuelPriceService,
    private fuelSpecificService: FuelSpecificService,
    private transportFactorService: TransportService,
  ) {}

  calculationIso14064(data: any) {
    throw new Error('Method not implemented.');
  }

  async calculationGHGProtocol(data: NetZeroBusinessTravelDto) {
    let energy = 0;
    let response = new emissionCalResDto();
    let { gwp_co2, gwp_ch4, gwp_n2o } =
      await this.service.getCommonEmissionFactors(
        data.year,
        data.baseData.countryCode,
        [
          emissionFactors.gwp_co2,
          emissionFactors.gwp_ch4,
          emissionFactors.gwp_n2o,
        ],
      );

    this.gwp_co2 = gwp_co2;
    this.gwp_ch4 = gwp_ch4;
    this.gwp_n2o = gwp_n2o;

    if (data.method === NetZeroBusinessTravelMethod.FUEL_BASE) {
      response = await this.calculateFuelBase(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    } else if (data.method === NetZeroBusinessTravelMethod.DISTANCE_BASE) {
      response = await this.calculateDistanceBase(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
      // response = await this.calculateDistanceBaseBT(
      //     data.distance.businessTravel,
      //     data.distance.fe,
      //     data.distance.fe_unit,
      //     data.year,
      //     data.month,
      //     data.baseData)
    } else {
      response = await this.calculateSpendBase(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    }

    return response;
  }

  /* Buisness Travel Calculation*/

  async calculateFuelBase(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
 

    let response = new emissionCalResDto();

    if (
      data.typeName == NetZeroBusinessTravelEmissionSourceDataTypeNames.Fuel
    ) {
      let ef = await this.fuelFactorService.getFuelFactors2(
        sourceName.Net_Zero_Business_Travel,
        baseData.sourceType,
        baseData.industry,
        baseData.tier,
        year,
        baseData.countryCode,
        [data.fuel_type],
      );
      if(ef===-1){
        throw new Error("No Fuel Emission Factor")
      }
      let co2 = 0;
      let ch4 = 0;
      let n2o = 0;
      let total = 0;
      let { gwp_co2, gwp_ch4, gwp_n2o } =
        await this.service.getCommonEmissionFactors(
          data.year,
          baseData.countryCode,
          [
            emissionFactors.gwp_co2,
            emissionFactors.gwp_ch4,
            emissionFactors.gwp_n2o,
          ],
        );
      console.log('gwp_co2, gwp_ch4, gwp_n2o', gwp_co2, gwp_ch4, gwp_n2o,ef);
      let unit = ParamterUnit.net_zero_business_travel_fuel;
      let value = data.quntity;

      let dataUnit = data.fuel_quntity_unit;

      if (dataUnit !== unit) {
        value = this.conversionService.convertUnit(value, dataUnit, unit).value;
      }
      console.log("value",value,dataUnit)

      if (ef.co2_default) {
        co2 += ((ef.co2_default * gwp_co2) / 1000) * value;
      }
      if (ef.ch4_default) {
        ch4 += ((ef.ch4_default * gwp_ch4) / 1000) * value;
      }
      if (ef.n20_default) {
        n2o += ((ef.n20_default * gwp_n2o) / 1000) * value;
      }
      response.e_sc_co2 = co2;
      response.e_sc_ch4 = ch4;
      response.e_sc_n2o = n2o;
      response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;
    } else if (
      data.typeName == NetZeroBusinessTravelEmissionSourceDataTypeNames.Grid
    ) {
      let { EF_GE } = await this.service.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [emissionFactors.EF_GE],
      );

      let unit = ParamterUnit.net_zero_business_travel_grid;
      let value = data.quntity;

      let dataUnit = data.grid_quntity_unit;

      if (dataUnit !== unit) {
        value = this.conversionService.convertUnit(value, dataUnit, unit).value;
      }
      response.e_sc = response.e_sc = data.quntity * EF_GE/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;
    } else {
      let E_RL: number;
      let GWP_RG_Val: number;

      let W_RG_unit = ParamterUnit.refrigerant_W_RG;

      let { GWP_RG_R407C } = await this.service.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R407C],
      );
      let { GWP_RG_R410A } = await this.service.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R410A],
      );
      let { GWP_RG_R22 } = await this.service.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R22],
      );
      let { GWP_RG_R134a } = await this.service.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R134a],
      );

      //console.log(GWP_RG_R407C,GWP_RG_R410A,GWP_RG_R22,GWP_RG_R134a)
      switch (data.refrigerant_type) {
        case 'R407C': {
          GWP_RG_Val = GWP_RG_R407C;
          break;
        }

        case 'R410A': {
          GWP_RG_Val = GWP_RG_R410A;
          break;
        }

        case 'R22': {
          GWP_RG_Val = GWP_RG_R22;
          break;
        }

        case 'R134a': {
          GWP_RG_Val = GWP_RG_R134a;
          break;
        }

        default: {
          GWP_RG_Val = 0;
        }
      }

      let value = data.quntity;

      let dataUnit = data.grid_quntity_unit;

      // if (dataUnit !== W_RG_unit){
      //     value = this.conversionService.convertUnit(value, dataUnit, W_RG_unit).value
      //  }

      E_RL = (value / 1000) * GWP_RG_Val;

      response.e_sc = E_RL/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;
    }

    // console.log(response);
    return response;
  }

  async calculateDistanceBase(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
    const ef = await this.service.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [emissionFactors[data.vehicleType]],
    );

    let response = new emissionCalResDto();

    if (
      data.typeName == NetZeroBusinessTravelEmissionSourceDataTypeNames.Distance
    ) {
      let unit = ParamterUnit.net_zero_business_travel_distance;
      const transportFactor = await this.transportFactorService.getTransFac(
        data.vehicleType,
      );
      let value = data.totalDistanceTravelled;
      let ef = 0;
      if (
        data.totalDistanceTravelled_unit ==
        ParamterUnit.net_zero_business_travel_passenger
      ) {
        ef=transportFactor.kgco2ePKm;
      } else {
        ef=transportFactor.kgco2eVKm;
      }
      console.log("transportFactor",transportFactor)
      // let dataUnit = data.totalDistanceTravelled_unit

      // if (dataUnit !== unit){
      //     value = this.conversionService.convertUnit(value, dataUnit, unit).value
      // }
      response.e_sc = value * ef/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;
    } else if (
      data.typeName == NetZeroBusinessTravelEmissionSourceDataTypeNames.Hotel
    ) {

     
      let res = await  this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Net_Zero_Business_Travel,
        [
          netZeroFactors.HOTEL_FACTOR
  
        ]);
        // console.log("netZeroFactors.HOTEL_FACTOR",res[ netZeroFactors.HOTEL_FACTOR],data.countryCode)
      let ef = data.user_input_ef ? data.user_input_ef : res[ netZeroFactors.HOTEL_FACTOR]? res[ netZeroFactors.HOTEL_FACTOR]:0;
      response.e_sc = response.e_sc = data.totalNumberHotelNight * ef/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;
    }
    return response;
  }
  async calculateSpendBase(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
   

    let response = new emissionCalResDto();
    let unit = ParamterUnit.net_zero_business_travel_amount;
    let value = data.totalAmountOnTravel;

    let dataUnit = data.totalAmountOnTravel_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }
  
    let res = await  this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Net_Zero_Business_Travel,
      [
        data.travel_type

      ]);
      let ef = data.user_input_ef ? data.user_input_ef : res[data.travel_type]? res[ data.travel_type]:0;
    response.e_sc = value * ef/1000;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
    return response;
  }
  /* Employee Commuting calculation */

 

  
}
