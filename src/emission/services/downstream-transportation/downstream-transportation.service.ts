import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';

import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

import { DownstreamTransportationEmissionSourceDataMethod } from 'src/emission/enum/DownstreamTransportationEmissionSourceDataMethod.enum';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { SpecificMethodParameters, NotSubMeteredParameters, SampleGroupParameters, AverageDataMethodFloorSpaceDataParameters, AverageDataMethodNotFloorSpaceDataParameters } from '../franchises/franchises.dto';
import { DTAverageDataMethodDataParameters, BackhaulParameters, DistanceBaseMethodDataParameters, DownstreamTransportationDto, ElectricityParameters, FuelParameters, RefrigerentParameters, SiteSpecificMethodParameters, SpendBaseMethodDataParameters } from './downstream-transportation.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { TransportService } from 'src/emission/emission-factors/transport.service';

enum DownstreamTransportationFuelBaseType {
  FUEL_DATA = "FUEL_DATA",
  ELECTRICITY_DATA = "ELECTRICITY_DATA",
  REFRIGENT_DATA = "REFRIGENT_DATA",
  BACKHAUL_DATA = "BACKHAUL_DATA",
}

@Injectable()
export class DownstreamTransportationService implements Iso14064Service, GHGProtocolService {
  constructor(
    private netZeroFactorService: NetZeroFactorService,
    private conversionService: UnitConversionService,
    private commonEmmissionFactorService: CommonEmissionFactorService,
    private fuelFactorService: FuelFactorService,
    private transportFactorService: TransportService
  ) { }

  calculationIso14064(data: any) {
    throw new Error('Method not implemented.');
  }

  async calculationGHGProtocol(data: DownstreamTransportationDto) {
    let response = new emissionCalResDto();
    switch (data.method) {
      case DownstreamTransportationEmissionSourceDataMethod.FUEL_BASE_METHOD:
        switch(data.data.typeName){
          case DownstreamTransportationFuelBaseType.FUEL_DATA:{
            response = await this.calculateFuelBaseFuel(data.data as FuelParameters, data.year, data.month, data.baseData)
            break;
          };     
          case DownstreamTransportationFuelBaseType.ELECTRICITY_DATA:{
            response = await this.calculateFuelBaseElectricity(data.data as ElectricityParameters, data.year, data.month, data.baseData)
            break;
          }
          case DownstreamTransportationFuelBaseType.REFRIGENT_DATA:{
            response = await this.calculateFuelBaseRefrigerent(data.data as RefrigerentParameters, data.year, data.month, data.baseData)
            break;
          }
          case DownstreamTransportationFuelBaseType.BACKHAUL_DATA:{
            response = await this.calculateFuelBaseBackhaul(data.data as BackhaulParameters, data.year, data.month, data.baseData)
            break;
          }
        }
        break;
      case DownstreamTransportationEmissionSourceDataMethod.DISTANCE_BASE_METHOD:
        response = await this.calculateDitstanceMethodData(data.data as DistanceBaseMethodDataParameters, data.year, data.month, data.baseData)
        break;
      case DownstreamTransportationEmissionSourceDataMethod.SPEND_BASE_METHOD:
        response = await this.calculateSpendBaseData(data.data as SpendBaseMethodDataParameters, data.year, data.month, data.baseData)
        break;
      case DownstreamTransportationEmissionSourceDataMethod.SITE_SPECIFIC_METHOD:
        response = await this.calculateSiteSpecificMethod(data.data as SiteSpecificMethodParameters, data.year, data.month, data.baseData)
        break;
      case DownstreamTransportationEmissionSourceDataMethod.AVERAGE_DATA_METHOD:
        response = await this.calculateAverageDataMethod(data.data as DTAverageDataMethodDataParameters, data.year, data.month, data.baseData)
        break;
    }
    return response;
  }

  async calculateFuelBaseBackhaul(data: BackhaulParameters, year: number, month: number, baseData: BaseDataDto):Promise<emissionCalResDto>{
    let response = new emissionCalResDto();
    let total = 0;

    let fuelUnit = ParamterUnit.downstream_fuel;
    let {quantity_of_fuel_consumed_from_backhaul, quantity_of_fuel_consumed_from_backhaul_unit, fuelBaseBackhaulFuelType} = data;
    let fuelEf = await this.getEqulantFuelFactor(baseData, year, fuelBaseBackhaulFuelType);

    if(quantity_of_fuel_consumed_from_backhaul_unit !== fuelUnit){       
       quantity_of_fuel_consumed_from_backhaul = this.conversionService.convertUnit(quantity_of_fuel_consumed_from_backhaul, quantity_of_fuel_consumed_from_backhaul_unit, fuelUnit).value;
    }

    total = quantity_of_fuel_consumed_from_backhaul * fuelEf;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateFuelBaseRefrigerent(data: RefrigerentParameters, year: number, month: number, baseData: BaseDataDto):Promise<emissionCalResDto>{
    let response = new emissionCalResDto();
    let total = 0;
    let refUnit = ParamterUnit.refrigerant_W_RG;

    let {quantity_of_refrigerent_leaked, quantity_of_refrigerent_leaked_unit, fuelBaseRefrigerantType} = data;

    if(quantity_of_refrigerent_leaked_unit !== refUnit){       
       quantity_of_refrigerent_leaked = this.conversionService.convertUnit(quantity_of_refrigerent_leaked, quantity_of_refrigerent_leaked_unit, refUnit).value;
    }
    let GWP_RG = await this.getGWPFRFactor(fuelBaseRefrigerantType, baseData, year);

    total = quantity_of_refrigerent_leaked * GWP_RG;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateFuelBaseElectricity(data: ElectricityParameters, year: number, month: number, baseData: BaseDataDto):Promise<emissionCalResDto>{
    let response = new emissionCalResDto();
    let total = 0;
    let {EF_GE} =await this.commonEmmissionFactorService.getCommonEmissionFactors(year, baseData.countryCode, [emissionFactors.EF_GE] );
    let elecUnit = ParamterUnit.downstream_electricity_consumption;
    let {quantity_of_electricity_consumed, quantity_of_electricity_consumed_unit} = data;

    if(quantity_of_electricity_consumed_unit !== elecUnit){       
       quantity_of_electricity_consumed = this.conversionService.convertUnit(quantity_of_electricity_consumed, quantity_of_electricity_consumed_unit, elecUnit).value;
    }
  
    total = quantity_of_electricity_consumed * EF_GE;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateFuelBaseFuel(data: FuelParameters, year: number, month: number, baseData: BaseDataDto):Promise<emissionCalResDto>{
    let response = new emissionCalResDto();
    let total = 0;

    let fuelUnit = ParamterUnit.downstream_fuel;
    let {quantity_of_fuel_consumed, quantity_of_fuel_consumed_unit, fuelBasefuelType} = data;

    if(quantity_of_fuel_consumed_unit !== fuelUnit){       
       quantity_of_fuel_consumed = this.conversionService.convertUnit(quantity_of_fuel_consumed, quantity_of_fuel_consumed_unit, fuelUnit).value;
    }
    let fuelEf = await this.getEqulantFuelFactor(baseData, year, fuelBasefuelType);

    total = quantity_of_fuel_consumed * fuelEf;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }


  async calculateDitstanceMethodData(data: DistanceBaseMethodDataParameters, year: number, month: number, baseData: BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;
    let areaUnit = ParamterUnit.franchises_area_unit;
    let energyUnit = ParamterUnit.franchises_energy_unit;

    let {mass_of_goods_purchased,distance_travelled_in_transport_leg,vehicle_type} = data;
    let {mass_of_goods_purchased_unit,distance_travelled_in_transport_leg_unit} = data;

    let vehicleTypeFt = await this.transportFactorService.getTransFac(vehicle_type)

    total = mass_of_goods_purchased * distance_travelled_in_transport_leg * vehicleTypeFt.kgco2ePKm ? vehicleTypeFt.kgco2ePKm : 0;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateSpendBaseData(data: SpendBaseMethodDataParameters, year: number, month: number, baseData: BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;

    let {amount_spent_on_transportation_by_type,shareOfTotalProjectCosts,eEIO_factor} = data;
    let {amount_spent_on_transportation_by_type_unit,shareOfTotalProjectCosts_unit,eEIO_factor_unit} = data;

    if(!eEIO_factor){
      let { EEIO } = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Downstream_Transportation_and_Distribution, [netZeroFactors.EEIO]);
      eEIO_factor = EEIO;
    }

    total = amount_spent_on_transportation_by_type * shareOfTotalProjectCosts * eEIO_factor;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateSiteSpecificMethod(data: SiteSpecificMethodParameters, year: number, month: number, baseData: BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;

    let volUnit = ParamterUnit.downstream_vol;
    let fuelUnit = ParamterUnit.downstream_fuel;
    let elecUnit = ParamterUnit.downstream_electricity_consumption;
    let refUnit = ParamterUnit.refrigerant_W_RG;

    // console.log("----------------------------------------------------------------")
    // console.log(data);

    let {volume_of_reporting_companys_purchased_goods, total_volume_of_goods_in_storage_facility, fuel_consumed,electricity_consumed,refrigerant_leakage,refrigerantType,fuelType} = data;
    let {volume_of_reporting_companys_purchased_goods_unit, total_volume_of_goods_in_storage_facility_unit, fuel_consumed_unit,electricity_consumed_unit,refrigerant_leakage_unit} = data;

    if(volume_of_reporting_companys_purchased_goods_unit !== volUnit){
      volume_of_reporting_companys_purchased_goods = this.conversionService.convertUnit(volume_of_reporting_companys_purchased_goods, volume_of_reporting_companys_purchased_goods_unit, volUnit).value;
    }
    if(total_volume_of_goods_in_storage_facility_unit !== volUnit){
      total_volume_of_goods_in_storage_facility = this.conversionService.convertUnit(total_volume_of_goods_in_storage_facility, total_volume_of_goods_in_storage_facility_unit, volUnit).value;
    }
    if(fuel_consumed_unit !== fuelUnit){
      fuel_consumed = this.conversionService.convertUnit(fuel_consumed, fuel_consumed_unit, fuelUnit).value;
    }
    if(electricity_consumed_unit !== elecUnit){
      electricity_consumed = this.conversionService.convertUnit(electricity_consumed, electricity_consumed_unit, elecUnit).value;
    }
    if(refrigerant_leakage_unit !== refUnit){
      refrigerant_leakage = this.conversionService.convertUnit(refrigerant_leakage, refrigerant_leakage_unit, refUnit).value;
    }
   
    let {EF_GE} =await this.commonEmmissionFactorService.getCommonEmissionFactors(year, baseData.countryCode, [emissionFactors.EF_GE ]);

    let GWP_RG = await this.getGWPFRFactor(refrigerantType, baseData, year);
    let fuelEf = await this.getEqulantFuelFactor(baseData, year, fuelType);

    // console.log(GWP_RG, fuelEf);

    let elecEmission = electricity_consumed * EF_GE;
    let fuelEmission = fuel_consumed+ fuelEf;
    let refEmission = refrigerant_leakage * GWP_RG;

    console.log("------ ", elecEmission, fuelEmission, refEmission)
    let storageEmission = elecEmission ? elecEmission: 0 + fuelEmission?fuelEmission:0 + refEmission ? refEmission : 0;
    // console.log(storageEmission)
    // console.log("----------------------------------------------------------------")
    total = (volume_of_reporting_companys_purchased_goods / total_volume_of_goods_in_storage_facility) * storageEmission;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    // console.log(response);
    // console.log("----------------------------------------------------------------")

    return response;
  }

  async calculateAverageDataMethod(data: DTAverageDataMethodDataParameters, year: number, month: number, baseData: BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;

    let volUnit = ParamterUnit.downstream_vol;
    let averageEfUnit = ParamterUnit.downstream_average_ef_unit;

    let {volume_of_stored_goods , average_number_of_days_stored, storage_facility_ef} = data;
    let {volume_of_stored_goods_unit , storage_facility_ef_unit} = data;

    if(volume_of_stored_goods_unit !== volUnit){
      volume_of_stored_goods = this.conversionService.convertUnit(volume_of_stored_goods, volume_of_stored_goods_unit, volUnit).value;
    }

    if(!storage_facility_ef){
      let { STORAGE_FACILITY_EF } = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Downstream_Transportation_and_Distribution, [netZeroFactors.STORAGE_FACILITY_EF]);
      storage_facility_ef = STORAGE_FACILITY_EF;
    }else{
      if(storage_facility_ef_unit !== averageEfUnit){
        storage_facility_ef = this.conversionService.convertUnit(storage_facility_ef, storage_facility_ef_unit, averageEfUnit).value;
      }
    }

    total = volume_of_stored_goods * average_number_of_days_stored * storage_facility_ef;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async getGWPFRFactor(refrigerantType: string, baseData: BaseDataDto, year: number): Promise<number> {
    let {GWP_RG_R407C,GWP_RG_R410A,GWP_RG_R22,GWP_RG_R134a} = await this.commonEmmissionFactorService.getCommonEmissionFactors(year, baseData.countryCode, [
      emissionFactors.GWP_RG_R407C,
      emissionFactors.GWP_RG_R410A,
      emissionFactors.GWP_RG_R22,
      emissionFactors.GWP_RG_R134a
    ] );


    let GWP_RG = 0;
    switch(refrigerantType){
      case 'R407C': {
        GWP_RG = GWP_RG_R407C;
        break;
      }
      case 'R410A': {
        GWP_RG = GWP_RG_R410A;
        break;
      }
      case 'R22': {
        GWP_RG = GWP_RG_R22;
        break;
      }
      case 'R134a': {
        GWP_RG = GWP_RG_R134a;
        break;
      }
      default: {
        GWP_RG = 0;
      }
    }

    return GWP_RG;
  }

  async getEqulantFuelFactor(baseData: BaseDataDto, year: number, fuelType: fuelType): Promise<number> {
    let ef = await this.fuelFactorService.getFuelFactors2(
      sourceName.Downstream_Transportation_and_Distribution,
      baseData.sourceType,
      baseData.industry,
      baseData.tier,
      year,
      baseData.countryCode,
      [fuelType],
    );

    // console.log("=========================",ef)

    let { gwp_ch4, gwp_co2, gwp_n2o, } = await this.commonEmmissionFactorService.getCommonEmissionFactors(year, baseData.countryCode,
      [emissionFactors.gwp_ch4,
      emissionFactors.gwp_co2,
      emissionFactors.gwp_n2o,]);
    
    let fuelEf = gwp_co2*ef.co2_default + gwp_ch4*ef.ch4_default + gwp_n2o*ef.n20_default;

    return fuelEf;
  }
}
