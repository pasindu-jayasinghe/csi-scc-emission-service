import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { FireExtinguisherType, FireExtinguisherTypeValue } from 'src/emission/enum/fireExtinguisherType.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { FireExtinguisherDto } from './fire-extinguisher.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';
import e from 'express';

@Injectable()
export class FireExtinguisherService implements Iso14064Service, GHGProtocolService {


    constructor(
      private service: CommonEmissionFactorService,
      private conversionService: UnitConversionService
    ) { }

  async calculationGHGProtocol(data: any) {

    let {gwp_co2} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.gwp_co2] );
      let e_sc:number = 0
    let gwp:number;
    let wwptUnit = ParamterUnit.fire_extinguisher_wwpt
    let value = data.wwpt
    switch (data.fet) {
      case FireExtinguisherType.CO2: {
        gwp = gwp_co2;
        break;
      }
      default: {
        gwp = 0
      }
    }

  

    let dataUnit = data.wwpt_unit
    if (dataUnit !== wwptUnit){
      value = this.conversionService.convertUnit(value, dataUnit, wwptUnit).value
    }
    if(data.stype == "FIXED"){
       e_sc = ( value * gwp *1/40) / 1000;
       console.log("aaaa",e_sc)
    }
    if(data.stype == "PORTABLE"){
      e_sc = ( value*data.not * gwp *7/200) / 1000;
   }
    let response = new emissionCalResDto();
    response.e_sc = e_sc
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

      return response;  }

    async calculationIso14064(data: FireExtinguisherDto) {
      let {gwp_co2} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.gwp_co2] );
      
      let gwp:number;
      let wwptUnit = ParamterUnit.fire_extinguisher_wwpt
      let value = data.wwpt
      switch (data.fet) {
        case FireExtinguisherType.CO2: {
          gwp = gwp_co2;
          break;
        }
        default: {
          gwp = 0
        }
      }

      let dataUnit = data.wwpt_unit
      if (dataUnit !== wwptUnit){
        value = this.conversionService.convertUnit(value, dataUnit, wwptUnit).value
      }

      let response = new emissionCalResDto();
      response.e_sc = (data.not * value * gwp) / 1000;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;

        return response;
      }
}
