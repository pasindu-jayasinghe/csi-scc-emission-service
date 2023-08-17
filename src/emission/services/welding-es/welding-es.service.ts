import { Injectable } from '@nestjs/common';
import { Hash } from 'crypto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { Double } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { weldingEsDto } from './welding-es.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class WeldingEsService implements Iso14064Service, GHGProtocolService  {

  constructor(
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService
  ) { }

  async calculationGHGProtocol(data: any) {

    let {ACEYTELENE_FACTOR} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.ACEYTELENE_FACTOR] );
    let {LIQUIDCO2_FACTOR} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.LIQUIDCO2_FACTOR] );

    let ac_unit = ParamterUnit.welding_es_ac
    let lc_unit = ParamterUnit.welding_es_lc

    let acVal = data.ac
    let lcVal = data.lc

    let emission1 : number;
    let emission2 : number;

    let acDataUnit = data.ac_unit;
    let lcdataUnit = data.lc_unit;

    if (acDataUnit !== ac_unit){
     acVal = this.conversionService.convertUnit(acVal, acDataUnit, ac_unit).value 
    }

    if (lcdataUnit !== lc_unit){
      lcVal = this.conversionService.convertUnit(lcVal, lcdataUnit, lc_unit).value
    }

    emission1 = acVal * ACEYTELENE_FACTOR; //0.003385;
    emission2 = lcVal * LIQUIDCO2_FACTOR; //0.001;
    var emission ={Acetylene: emission1 ?  emission1: 0 ,liquidCo2:emission2? emission2:0};

    let response = new emissionCalResDto();
    response.e_sc = emission1 + emission2;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = emission2;
    response.e_sc_n2o = 0;
    response.data = JSON.stringify(emission);

    return response;  }

    async calculationIso14064(data: weldingEsDto) {

      let {ACEYTELENE_FACTOR} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.ACEYTELENE_FACTOR] );
      let {LIQUIDCO2_FACTOR} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.LIQUIDCO2_FACTOR] );

      let ac_unit = ParamterUnit.welding_es_ac
      let lc_unit = ParamterUnit.welding_es_lc

      let acVal = data.ac
      let lcVal = data.lc

      let emission1 : number;
      let emission2 : number;

      let acDataUnit = data.ac_unit;
      let lcdataUnit = data.lc_unit;

      if (acDataUnit !== ac_unit){
       acVal = this.conversionService.convertUnit(acVal, acDataUnit, ac_unit).value 
      }

      if (lcdataUnit !== lc_unit){
        lcVal = this.conversionService.convertUnit(lcVal, lcdataUnit, lc_unit).value
      }

      emission1 = acVal * ACEYTELENE_FACTOR; //0.003385;
      emission2 = lcVal * LIQUIDCO2_FACTOR; //0.001;
      var emission ={Acetylene: emission1 ?  emission1: 0 ,liquidCo2:emission2? emission2:0};

      let response = new emissionCalResDto();
      response.e_sc = emission1 + emission2;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = emission2;
      response.e_sc_n2o = 0;
      response.data = JSON.stringify(emission);

      return response;
    }

}

