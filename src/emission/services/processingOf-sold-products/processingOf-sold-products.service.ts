import { Injectable } from '@nestjs/common';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { ProcessingOfSoldProductDataTypeNames, ProcessingOfSoldProductDto } from './processingOf-sold-products.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ProcessingofSoldProductMethods } from 'src/emission/enum/processingofSoldProducts.enum';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
@Injectable()
export class ProcessingOfSoldProductsService implements Iso14064Service, GHGProtocolService {
  public gwp_co2: number;
  public gwp_ch4: number;
  public gwp_n2o: number;
  public typeName: string


  constructor(
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService,
     private  netZeroFactorService: NetZeroFactorService
  
  ) { }

  async calculationGHGProtocol(data: ProcessingOfSoldProductDto) {

    console.log("ssssss", data)
    let e_sc = 0;





    switch (true) {
      case data.data['fuel_type'] !== undefined:
        this.typeName = ProcessingOfSoldProductDataTypeNames.Fuel;
        break;
      case data.data['refrigerant_type'] !== undefined:
        this.typeName = ProcessingOfSoldProductDataTypeNames.Ref;
        break;
      case data.data['waste_type'] !== undefined:
        this.typeName = ProcessingOfSoldProductDataTypeNames.Waste;
        break;
    }

    console.log("TYPE---", this.typeName)


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

    if (data.activityType === ProcessingofSoldProductMethods.SITE_SPECIFIC_METHOD) {
      response = await this.calculateSiteSpecificMethod(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    } else if (data.activityType === ProcessingofSoldProductMethods.AVERAGE_DATA_METHOD) {
      response = await this.calculateAverageDataMethod(
        data.data,
        data.year,
        data.month,
        data.baseData,
      );
    }

    // console.log("rrr", response)
    return response;
  }

  async calculateAverageDataMethod(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
    /*  let ef = data.user_input_ef ? data.user_input_ef : 0; */




    let response = new emissionCalResDto();
    let unit = ParamterUnit.mass_of_sold_intermediate_product;
    let value = data.mass;

    let dataUnit = data.mass_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }
    console.log("ssssk"        ,baseData
    )

    let res = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Processing_of_Sold_Products,
      [
        // netZeroFactors.PROCESSING_OF_SOLD_PRODUCTS
        data.sold_intermediate_type

      ]);


    console.log("netZeroFactors.PROCESSING_OF_SOLD_PRODUCTS", res[netZeroFactors.PROCESSING_OF_SOLD_PRODUCTS], data.countryCode)
    let ef = data.user_input_ef ? data.user_input_ef : res[data.sold_intermediate_type] ? res[data.sold_intermediate_type] : 0;


    console.log("kkk",ef,value)
    response.e_sc = value * ef/1000;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
    return response;
  }



  async calculateSiteSpecificMethod(
    data: any,
    year: number,
    month: number,
    baseData: BaseDataDto,
  ) {
    /*  let ef = await this.fuelFactorService.getFuelFactors2(
       sourceName.passenger_road,
       baseData.sourceType,
       baseData.industry,
       baseData.tier,
       year,
       baseData.countryCode,
       [data.fuel_type],
     ); */


    let response = new emissionCalResDto();

    if (
      this.typeName == ProcessingOfSoldProductDataTypeNames.Ref
    ) {
      let E_RL: number;
      let GWP_RG_Val: number;

      let W_RG_unit = ParamterUnit.refrigerant_W_RG;

      let { GWP_RG_R407C } = await this.service.getCommonEmissionFactors(
        data.year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R407C],
      );
      let { GWP_RG_R410A } = await this.service.getCommonEmissionFactors(
        data.year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R410A],
      );
      let { GWP_RG_R22 } = await this.service.getCommonEmissionFactors(
        data.year,
        baseData.countryCode,
        [emissionFactors.GWP_RG_R22],
      );
      let { GWP_RG_R134a } = await this.service.getCommonEmissionFactors(
        data.year,
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

      let dataUnit = data.refrigerant_quntity_unit;

      E_RL = (value / 1000) * GWP_RG_Val;

      response.e_sc = E_RL;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;
    }
    else if (
      this.typeName == ProcessingOfSoldProductDataTypeNames.Waste
    ) {
      let { PIGGERY_FEEDRATE } = await this.service.getCommonEmissionFactors(
        data.year,
        baseData.countryCode,
        [emissionFactors.PIGGERY_FEEDRATE],
      );

      let unit = ParamterUnit.mass_of_waste_output;
      let value = data.mass;

      let dataUnit = data.mass_unit;


      console.log("waste---",data )

      if (dataUnit !== unit) {
        value = this.conversionService.convertUnit(value, dataUnit, unit).value;
      }
      response.e_sc = value * PIGGERY_FEEDRATE/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;
    }
    else if (
      this.typeName == ProcessingOfSoldProductDataTypeNames.Fuel
    ) {

      // let ef = data.user_input_ef ? data.user_input_ef : 0;
      let unit = ParamterUnit.fuel_consumed;
      let value = data.quntity;

      let dataUnit = data.quntity_unit;

      if (dataUnit !== unit) {

        value = this.conversionService.convertUnit(value, dataUnit, unit).value;
      }


      let res = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Processing_of_Sold_Products,
        [
          data.fuel_type
        ]);
      console.log("netZeroFactors.FUEL_SOURCE", res[netZeroFactors.FUEL_SOURCE], data.countryCode)
      let ef = data.user_input_ef ? data.user_input_ef : res[data.fuel_type] ? res[data.fuel_type] : 0;


      console.log("RRRRR",value,ef)

      response.e_sc = value * ef/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;

    }
    else {
      // let ef = data.user_input_ef ? data.user_input_ef : 0;
      let unit = ParamterUnit.electricity_consumed;
      let value = data.quntity;
      let dataUnit = data.eletricity_quntity_unit;
      if (dataUnit !== unit) {
        value = this.conversionService.convertUnit(value, dataUnit, unit).value;
      }

      let res = await this.netZeroFactorService.getNetZeroFactors(year, data.countryCode, sourceName.Processing_of_Sold_Products,
        [
          netZeroFactors.ELECTRICITY

        ]);
      console.log("netZeroFactors.ELECTRICITY", res[netZeroFactors.ELECTRICITY], data.countryCode)
      let ef = data.user_input_ef ? data.user_input_ef : res[netZeroFactors.ELECTRICITY] ? res[netZeroFactors.ELECTRICITY] : 0;

      response.e_sc = value * ef/1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;

    }

    // console.log(response);
    return response;
  }



  async calculationIso14064(data: ProcessingOfSoldProductDto) {

    let response = new emissionCalResDto();
    response.e_sc = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;
  }

}
