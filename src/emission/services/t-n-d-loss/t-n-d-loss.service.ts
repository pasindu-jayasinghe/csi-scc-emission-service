import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class TNDLossService implements Iso14064Service, GHGProtocolService  {

    constructor(
        private service: CommonEmissionFactorService,
        private converesionService: UnitConversionService
    ){

    }

    calculationGHGProtocol(data: any) {
        throw new Error('Method not implemented.');
    }

    async calculationIso14064(data){
        let ec_unit = ParamterUnit.electricity_consumption;
        let value = data.ec;
        let {TD_LOSS, EF_GE} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.TD_LOSS, emissionFactors.EF_GE] );
              
        let dataUnit = data.ec_unit
  
        if (dataUnit !== ec_unit){
          value = this.converesionService.convertUnit(value, dataUnit, ec_unit).value
        }
  
        let response = new emissionCalResDto();
        response.e_sc = (((TD_LOSS/100) * value) / (1 - (TD_LOSS/100))) * EF_GE;
        response.e_sc_ch4 = 0;
        response.e_sc_co2 = 0;
        response.e_sc_n2o = 0;
  
        return response ;
    }
}
