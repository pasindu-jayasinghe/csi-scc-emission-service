import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactor } from 'src/emission/emission-factors/common-emission-factor.entity';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { cookingGasDto } from './cooking-gas.dto';
import { CookingGas } from './cooking-gas.enum';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class CookingGasService implements Iso14064Service, GHGProtocolService {

  constructor(
    private service: CommonEmissionFactorService,
    private fuelSpecificService: FuelSpecificService,
    private conversionService: UnitConversionService,
    private fuelFactorService: FuelFactorService,
  ) { }

  calculationGHGProtocol(data: cookingGasDto) {
    return this.calculationIso14064(data);
  }


  async calculationIso14064(data: cookingGasDto) {

    let te_sc: number;
    let e_sc: number;
    let ef_co2: number;
    let ef_ch4: number;
    let ef_n2o: number;
    let ncv: number;
    let e_sc_co2: number;
    let e_sc_ch4: number;
    let e_sc_n2o: number;

    let fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.gasType])

    let fuelFactor = await this.fuelFactorService.getFuelFactors2(sourceName.cooking_gas, data.baseData.sourceType, data.baseData.industry, data.baseData.tier,
      data.year, data.baseData.countryCode, [data.gasType]
      );
    
    console.log("fuelFactor",fuelFactor)
    let fcn_unit = ParamterUnit.cooking_gas_consumption;
    let value = data.fcn

    let { gwp_ch4, gwp_co2, gwp_n2o, } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
        [emissionFactors.gwp_ch4,
        emissionFactors.gwp_co2,
        emissionFactors.gwp_n2o,]);


    ef_co2 = fuelFactor.co2_default;
    ef_ch4 = fuelFactor.ch4_default;
    ef_n2o = fuelFactor.n20_default;
    ncv = fuelSpecific.ncv;


    let dataUnit = data.fcnUnit
    if (dataUnit !== fcn_unit) {
      value = this.conversionService.convertUnit(value, dataUnit, fcn_unit).value
    }

    te_sc = (value / 1000) * ncv

    e_sc_co2 = ((ef_co2 * gwp_co2) / 1000) * te_sc
    e_sc_ch4 = ((ef_ch4 * gwp_ch4) / 1000) * te_sc
    e_sc_n2o = ((ef_n2o * gwp_n2o) / 1000) * te_sc

    e_sc = ((ef_co2 * gwp_co2) / 1000) * te_sc + ((ef_ch4 * gwp_ch4) / 1000) * te_sc + ((ef_n2o * gwp_n2o) / 1000) * te_sc

    var emission = { e_sc_co2: e_sc_co2, e_sc_ch4: e_sc_ch4, e_sc_n2o: e_sc_n2o, e_sc: e_sc };

    let response = new emissionCalResDto();
    response.e_sc = e_sc;
    response.e_sc_ch4 = e_sc_ch4;
    response.e_sc_co2 = e_sc_co2;
    response.e_sc_n2o = e_sc_n2o;
    response.data = JSON.stringify(emission);
    //console.log(te_sc,ef_co2,ef_ch4,ef_n2o)
    return response;

  }


}