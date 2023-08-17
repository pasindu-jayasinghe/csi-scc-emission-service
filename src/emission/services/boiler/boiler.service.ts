import { Injectable } from '@nestjs/common';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { FuelSpecificService } from 'src/emission/emission-factors/fuel-specific.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { boilerDto } from './boiler.dto';
import { boilerEnum } from './boiler.enum';
import { async } from 'rxjs';
import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

@Injectable()
export class BoilerService implements Iso14064Service, GHGProtocolService {

  constructor(
    private fuelSpecificService: FuelSpecificService,
    private service: CommonEmissionFactorService,
    private conversionService: UnitConversionService,
    private fuelFactorService: FuelFactorService,
  ) { }

  async calculationGHGProtocol(data: any) {

    let response = this.calculationIso14064(data);

    return response
  }

  public fuelSpecific: any;

  async calculationIso14064(data: boilerDto) {
    console.log("data", data)
    let te_sc: number;
    let e_sc: number;
    let e_sc_co2: number;
    let e_sc_ch4: number;
    let e_sc_n2o: number;
    let ef_co2: number;
    let ef_ch4: number;
    let ef_n2o: number;
    let ncv: number;
    let density: number;
    //console.log("data",data)
    let fuelSpecific = await this.fuelSpecificService.getFuelSpecification(data.year, data.baseData.countryCode, [data.fuel])
    //console.log("fuelSpecific",fuelSpecific)

    let fuelFactor = await this.fuelFactorService.getFuelFactors2(sourceName.boilers, data.baseData.sourceType, data.baseData.industry, data.baseData.tier,
      data.year, data.baseData.countryCode, [data.fuel])
    console.log("fuelFactor", fuelFactor)

    let consumptionUnit_furnanceOil = ParamterUnit.boiler_consumption_furnanceOil
    let consumptionUnit_solidBiomass = ParamterUnit.boiler_consumption_solidBiomass
    let value = data.consumption

    let {
      gwp_ch4, gwp_co2, gwp_n2o, } = await this.service.getCommonEmissionFactors(data.year, data.baseData.countryCode,
        [
          emissionFactors.gwp_ch4,
          emissionFactors.gwp_co2,
          emissionFactors.gwp_n2o,
        ]);

    // switch (data.boilerType + data.fuelType) {

    //   case boilerEnum.Furnace_Oil + fuelType.RESIDUAL_FUEL_OIL: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }

    //   case boilerEnum.Solid_Biomass + fuelType.WOOD_WOOD_WASTE: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }

    //   case boilerEnum.Solid_Biomass + fuelType.SULPHITE_LYES_BLACK_LIQUOR: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }

    //   case boilerEnum.Solid_Biomass + fuelType.OTHER_PRIMARY_SOLID_BIOMASS: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }

    //   case boilerEnum.Solid_Biomass + fuelType.CHARCOAL: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }

    //   case boilerEnum.Solid_Biomass + fuelType.SAW_DUST: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }

    //   case boilerEnum.Solid_Biomass + fuelType.WOOD_CHIPS: {

    //     ef_co2 = fuelFactor.co2_default;
    //     ef_ch4 = fuelFactor.ch4_default;
    //     ef_n2o = fuelFactor.n20_default;
    //     ncv = fuelSpecific.ncv;
    //     density = fuelSpecific.density;

    //     break;
    //   }


    //   default: {

    //     ef_co2 = 0;
    //     ef_ch4 = 0;
    //     ef_n2o = 0;
    //     ncv = 0;
    //     density = 0;

    //   }

    // }


    if (fuelFactor === -1) {

      ef_co2 = 0;
      ef_ch4 = 0;
      ef_n2o = 0;
      ncv = 0;
      density = 0;

    } else {

      ef_co2 = fuelFactor.co2_default;
      ef_ch4 = fuelFactor.ch4_default;
      ef_n2o = fuelFactor.n20_default;
      ncv = fuelSpecific.ncv;
      density = fuelSpecific.density;
    }


    switch (data.fuelType) {

      case boilerEnum.Furnace_Oil: {

        let dataUnit = data.consumption_unit
        if (dataUnit !== consumptionUnit_furnanceOil) {
          value = this.conversionService.convertUnit(value, dataUnit, consumptionUnit_furnanceOil).value
        }

        te_sc = (value / 1000) * ncv * density;
        break;
      }

      case boilerEnum.Solid_Biomass: {

        let dataUnit = data.consumption_unit
        if (dataUnit !== consumptionUnit_solidBiomass) {
          value = this.conversionService.convertUnit(value, dataUnit, consumptionUnit_solidBiomass).value
        }

        te_sc = (value / 1000) * ncv;
        break;
      }

    }

    //te_sc = (value / 1000) * ncv * density

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

    return response;

  }
}
