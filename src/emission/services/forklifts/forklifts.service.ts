import { Injectable } from '@nestjs/common';
import { Hash } from 'crypto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { Double } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { forkliftsDto } from './forklifts.dto';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class ForkliftsService implements Iso14064Service, GHGProtocolService  {

  constructor(
    private conversionService: UnitConversionService
  ) { }

  calculationGHGProtocol(data: any) {
    throw new Error('Method not implemented.');
  }

  async calculationIso14064(data: forkliftsDto) {

    let consumptionUnit = ParamterUnit.forklift_consumption
    let value = data.consumption;
    let dataUnit = data.consumption_unit
    if (dataUnit !== consumptionUnit){
      value = this.conversionService.convertUnit(value, dataUnit, consumptionUnit).value
    }
    let response = new emissionCalResDto();
    response.e_sc = value * 1000;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
    
    return response;
  }

}