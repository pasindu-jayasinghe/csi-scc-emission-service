import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { electricityDto } from './electricity.dto';
import { Iso14064Service } from '../iso14064.service';
import { GHGProtocolService } from '../GHGProtocol.service';

@Injectable()
export class ElectricityService implements Iso14064Service, GHGProtocolService {

  constructor(
    private service: CommonEmissionFactorService,
    private converesionService: UnitConversionService
  ) { }

  async calculationGHGProtocol(data: any) {
    console.log("ss",data)
    let ec_unit = ParamterUnit.electricity_consumption;
    let value = data.ec;
    let {EF_GE} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.EF_GE] );
          
    let dataUnit = data.ec_unit

    if (dataUnit !== ec_unit){
      value = this.converesionService.convertUnit(value, dataUnit, ec_unit).value
    }

    let response = new emissionCalResDto();
    response.e_sc = value * EF_GE ;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response ;
  }

    async calculationIso14064(data: electricityDto) {
      let ec_unit = ParamterUnit.electricity_consumption;
      let value = data.ec;
      let {EF_GE} =await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode, [emissionFactors.EF_GE] );
            
      let dataUnit = data.ec_unit

      if (dataUnit !== ec_unit){
        value = this.converesionService.convertUnit(value, dataUnit, ec_unit).value
      }

      let response = new emissionCalResDto();
      response.e_sc = value * EF_GE ;
      response.e_sc_ch4 = 0;
      response.e_sc_co2 = 0;
      response.e_sc_n2o = 0;

      return response ;
    }

  

     
   }





