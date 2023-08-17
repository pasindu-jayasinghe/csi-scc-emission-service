import { Injectable } from '@nestjs/common';
import { GHGProtocolService } from '../GHGProtocol.service';
import { CombustedData, ElectricityData, FuelData, GreenhouseData, IndirectElectricityData, IndirectFuelData, IndirectGHGData, IndirectRefrigerantdata, IntermediateData, RefrigerantData, UseOfSoldProductsDto } from './net-zero-use-of-sold-products.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { CommonEmissionFactorService } from 'src/emission/emission-factors/common-emission-factor.service';
import { emissionFactors } from 'src/emission/enum/emissionFactors.enum';
import { NetZeroBusinessTravelMethod } from 'src/emission/enum/netZeroBusinessTravelMethod.enum';
import { UseOfSoldProductsMethod, UseOfSoldProductsTypeNames } from 'src/emission/enum/net-zero-use-of-sold-products.enum';
import { FuelFactorService } from 'src/emission/emission-factors/fuel-factor.service';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { fuelType } from 'src/emission/enum/fuelType.enum';

@Injectable()
export class NetZeroUseOfSoldProductsService implements GHGProtocolService {

  tier: string
  countryCode: string
  year: number
  gwp_co2: number
  gwp_ch4: number
  gwp_n2o: number

  constructor(

    private commonEmissionFactorService: CommonEmissionFactorService,
    private netZeroFactorService: NetZeroFactorService,
    private conversionService: UnitConversionService,
    private fuelFactorService: FuelFactorService,
  ) { }

  async calculationGHGProtocol(data: UseOfSoldProductsDto) {
    let response = new emissionCalResDto()

    this.year = data.year
    this.countryCode = data.baseData.countryCode
    this.tier = data.baseData.tier

    let { gwp_co2, gwp_ch4, gwp_n2o } = await this.commonEmissionFactorService.getCommonEmissionFactors(this.year, this.countryCode,
      [
        emissionFactors.gwp_co2,
        emissionFactors.gwp_ch4,
        emissionFactors.gwp_n2o,
      ],
    );

    this.gwp_co2 = gwp_co2; this.gwp_ch4 = gwp_ch4; this.gwp_n2o = gwp_n2o

    if (data.mode === UseOfSoldProductsMethod.DIRECT_ENERGY) {
      response = await this.calculationDirectEnergyMethod(data.data, data.baseData, data.year)
    } else if (data.mode === UseOfSoldProductsMethod.DIRECT_COMBUSTED) {
      response = await this.calculateDirectCombustedMethod(data.data, data.baseData, data.year)
    } else if (data.mode === UseOfSoldProductsMethod.DIRECT_GREENHOUSE) {
      response = await this.calculationDirectGreenhouseMethod(data.data, data.baseData, data.year)
    } else if (data.mode === UseOfSoldProductsMethod.INDIRECT_ENERGY) {
      response = await this.calculationIndirectEnergyMethod(data.data, data.baseData, data.year)
    } else if (data.mode === UseOfSoldProductsMethod.INTERMEDIATE_PRODUCTS) {
      response = await this.calculationIntermediateProductsMethod(data.data, data.baseData, data.year)
    }
    return response
  }

  async calculationDirectEnergyMethod(data: any, baseDataDto: BaseDataDto, year: number) {
    let response = new emissionCalResDto()

    if (data.typeName === UseOfSoldProductsTypeNames.direct_fuel) {
      response = await this.calculateDirectFuel(data, baseDataDto, year)
    }
    if (data.typeName === UseOfSoldProductsTypeNames.direct_electricity) {
      response = await this.calculateDirectElectricity(data, baseDataDto, year)
    }
    if (data.typeName === UseOfSoldProductsTypeNames.direct_refrigerant) {
      response = await this.calculateDirectRefrigerant(data, baseDataDto, year)
    }
    return response;
  }

  async calculateDirectFuel(data: FuelData, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let ef = await this.fuelFactorService.getFuelFactors2(
      sourceName.Use_of_Sold_Products,
      baseData.sourceType,
      baseData.industry,
      baseData.tier,
      year,
      baseData.countryCode,
      [fuelType[data.fuel_type]],
    );
    if (ef === -1) {
      throw new Error("No Fuel Emission Factor")
    }
    let co2 = 0;
    let ch4 = 0;
    let n2o = 0;
    let total = 0;
    let { gwp_co2, gwp_ch4, gwp_n2o } =
      await this.commonEmissionFactorService.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [
          emissionFactors.gwp_co2,
          emissionFactors.gwp_ch4,
          emissionFactors.gwp_n2o,
        ],
      );
    let unit = ParamterUnit.use_of_sold_product_fuel;
    let value = data.fuel_consumption;

    let dataUnit = data.fuel_consumption_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }
    const energy = (data.fuel_lifetime * data.fuel_number_of_sold * value) / 1000
    if (ef.co2_default) {
      co2 += ((ef.co2_default * gwp_co2) / 1000) * energy;
    }
    if (ef.ch4_default) {
      ch4 += ((ef.ch4_default * gwp_ch4) / 1000) * energy;
    }
    if (ef.n20_default) {
      n2o += ((ef.n20_default * gwp_n2o) / 1000) * energy;
    }
    response.e_sc_co2 = co2;
    response.e_sc_ch4 = ch4;
    response.e_sc_n2o = n2o;
    response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

    return response;
  }

  async calculateDirectElectricity(data: ElectricityData, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let { EF_GE } = await this.commonEmissionFactorService.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [emissionFactors.EF_GE],
    );

    let unit = ParamterUnit.use_of_sold_product_grid
    let value = data.elec_consumption;

    let dataUnit = data.elec_consumption_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }

    response.e_sc = (data.elec_lifetime * data.elec_number_of_sold * value * EF_GE) / 1000;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;
  }

  async calculateDirectRefrigerant(data: RefrigerantData, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto();
    let E_RL: number;
    let GWP_RG_Val: number;

    let ef = await this.commonEmissionFactorService.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [emissionFactors['GWP_RG_' + data.ref_type]],
    );
    GWP_RG_Val = ef['GWP_RG_' + data.ref_type];

    let value = data.ref_leakage;

    let dataUnit = data.ref_leakage_unit;
    let W_RG_unit = ParamterUnit.use_of_sold_product_ref;
    if (dataUnit !== W_RG_unit) {
      value = this.conversionService.convertUnit(value, dataUnit, W_RG_unit).value
    }

    E_RL = (value / 1000) * GWP_RG_Val;
    const energy = data.ref_lifetime * data.ref_number_of_sold * E_RL
    response.e_sc = energy / 1000;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;
  }

  async calculateDirectCombustedMethod(data: any, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()

    let ef = await this.fuelFactorService.getFuelFactors2(
      sourceName.Use_of_Sold_Products,
      baseData.sourceType,
      baseData.industry,
      baseData.tier,
      year,
      baseData.countryCode,
      [fuelType[data.fuel_type]],
    );
    if (ef === -1) {
      throw new Error("No Fuel Emission Factor")
    }
    let co2 = 0;
    let ch4 = 0;
    let n2o = 0;
    let { gwp_co2, gwp_ch4, gwp_n2o } =
      await this.commonEmissionFactorService.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [
          emissionFactors.gwp_co2,
          emissionFactors.gwp_ch4,
          emissionFactors.gwp_n2o,
        ],
      );
    let unit = ParamterUnit.use_of_sold_product_fuel;
    let value = data.total_quantity;

    let dataUnit = data.total_quantity_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }
    const energy = value / 1000;
    if (ef.co2_default) {
      co2 += ((ef.co2_default * gwp_co2) / 1000) * energy;
    }
    if (ef.ch4_default) {
      ch4 += ((ef.ch4_default * gwp_ch4) / 1000) * energy;
    }
    if (ef.n20_default) {
      n2o += ((ef.n20_default * gwp_n2o) / 1000) * energy;
    }
    response.e_sc_co2 = co2;
    response.e_sc_ch4 = ch4;
    response.e_sc_n2o = n2o;
    response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

    return response;
  }

  async calculationDirectGreenhouseMethod(data: any, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let gases = ['co2', 'ch4', 'n2o']
    let refGases = ['R407C', 'R410A', 'R22', 'R134a']
    if (gases.includes(data.ghg_type)) data.ghg_type = 'gwp_' + data.ghg_type
    else if (refGases.includes(data.ghg_type)) data.ghg_type = 'GWP_RG_' + data.ghg_type
    let gwp = await this.commonEmissionFactorService.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [data.ghg_type],
    );

    let value = data.ghg_amount;

    let dataUnit = data.ghg_amount_unit;
    let default_unit = ParamterUnit.use_of_sold_product_ref;
    if (dataUnit !== default_unit) {
      value = this.conversionService.convertUnit(value, dataUnit, default_unit).value
    }
    const energy = (value * data.number_of_products * data.percentage_of_released * gwp[data.ghg_type]) / 1000
    response.e_sc = energy;
    return response;
  }

  async calculationIndirectEnergyMethod(data: any, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()

    if (data.typeName === UseOfSoldProductsTypeNames.indirect_fuel) {
      response = await this.calculateIndirectFuel(data, baseData, year)
    }
    if (data.typeName === UseOfSoldProductsTypeNames.indirect_electricity) {
      response = await this.calculateIndirectElectricity(data, baseData, year)
    }
    if (data.typeName === UseOfSoldProductsTypeNames.indirect_refrigerant) {
      response = await this.calculateIndirectRefrigerant(data, baseData, year)
    }
    if (data.typeName === UseOfSoldProductsTypeNames.indirect_ghg) {
      response = await this.calculateIndirectGHG(data, baseData, year)
    }
    return response;
  }

  async calculateIndirectFuel(data: IndirectFuelData, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let ef = await this.fuelFactorService.getFuelFactors2(
      sourceName.Use_of_Sold_Products,
      baseData.sourceType,
      baseData.industry,
      baseData.tier,
      year,
      baseData.countryCode,
      [data.fuel_type],
    );
    if (ef === -1) {
      throw new Error("No Fuel Emission Factor")
    }
    let co2 = 0;
    let ch4 = 0;
    let n2o = 0;
    let total = 0;
    let { gwp_co2, gwp_ch4, gwp_n2o } =
      await this.commonEmissionFactorService.getCommonEmissionFactors(
        year,
        baseData.countryCode,
        [
          emissionFactors.gwp_co2,
          emissionFactors.gwp_ch4,
          emissionFactors.gwp_n2o,
        ],
      );
    let unit = ParamterUnit.use_of_sold_product_fuel;
    let value = data.indir_fuel_consumption;

    let dataUnit = data.indir_fuel_consumption_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }
    const energy = (data.indir_fuel_lifetime * data.indir_fuel_percentage_of_lifetime * data.indir_fuel_number_of_sold * value) / 1000
    if (ef.co2_default) {
      co2 += ((ef.co2_default * gwp_co2) / 1000) * energy;
    }
    if (ef.ch4_default) {
      ch4 += ((ef.ch4_default * gwp_ch4) / 1000) * energy;
    }
    if (ef.n20_default) {
      n2o += ((ef.n20_default * gwp_n2o) / 1000) * energy;
    }
    response.e_sc_co2 = co2;
    response.e_sc_ch4 = ch4;
    response.e_sc_n2o = n2o;
    response.e_sc = response.e_sc_co2 + response.e_sc_ch4 + response.e_sc_n2o;

    return response;
  }

  async calculateIndirectElectricity(data: IndirectElectricityData, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto();

    let { EF_GE } = await this.commonEmissionFactorService.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [emissionFactors.EF_GE],
    );

    let unit = ParamterUnit.use_of_sold_product_grid
    let value = data.indir_elec_consumption;

    let dataUnit = data.indir_elec_consumption_unit;

    if (dataUnit !== unit) {
      value = this.conversionService.convertUnit(value, dataUnit, unit).value;
    }

    const energy = (data.indir_elec_lifetime * data.indir_elec_percentage_of_lifetime * data.indir_elec_number_of_sold) / 1000

    response.e_sc = energy * value * EF_GE;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;
    
    return response;
  }

  async calculateIndirectRefrigerant(data: IndirectRefrigerantdata, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let E_RL: number;
    let GWP_RG_Val: number;

    let ef = await this.commonEmissionFactorService.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [emissionFactors['GWP_RG_' + data.ref_type]],
    );
    GWP_RG_Val = ef['GWP_RG_' + data.ref_type];

    let value = data.indir_ref_leakage;

    let dataUnit = data.indir_ref_leakage_unit;
    let W_RG_unit = ParamterUnit.use_of_sold_product_ref;
    if (dataUnit !== W_RG_unit) {
      value = this.conversionService.convertUnit(value, dataUnit, W_RG_unit).value
    }

    E_RL = (value / 1000) * GWP_RG_Val;
    const energy = (data.indir_ref_lifetime * data.indir_ref_percentage_of_lifetime * data.indir_ref_number_of_sold * value * E_RL) / 1000
    response.e_sc = energy;
    response.e_sc_ch4 = 0;
    response.e_sc_co2 = 0;
    response.e_sc_n2o = 0;

    return response;

  }

  async calculateIndirectGHG(data: IndirectGHGData, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let gases = ['co2', 'ch4', 'n2o']
    let refGases = ['R407C', 'R410A', 'R22', 'R134a']
    if (gases.includes(data.ghg_type)) data.ghg_type = 'gwp_' + data.ghg_type
    else if (refGases.includes(data.ghg_type)) data.ghg_type = 'GWP_RG_' + data.ghg_type
    let gwp = await this.commonEmissionFactorService.getCommonEmissionFactors(
      year,
      baseData.countryCode,
      [emissionFactors[data.ghg_type]],
    );


    let value = data.indir_ghg_emit;

    let dataUnit = data.indir_ghg_emit_unit;
    let default_unit = ParamterUnit.use_of_sold_product_ref;
    if (dataUnit !== default_unit) {
      value = this.conversionService.convertUnit(value, dataUnit, default_unit).value
    }
    const energy = (data.indir_ghg_lifetime * data.indir_ghg_percentage_of_lifetime * data.indir_ghg_number_of_sold * value * gwp[data.ghg_type]) / 1000

    response.e_sc = energy;
    return response;
  }

  async calculationIntermediateProductsMethod(data: any, baseData: BaseDataDto, year: number) {
    let response = new emissionCalResDto()
    let energy = (data.intermediate_sold * data.intermediate_lifetime) / 1000

    if (data.intermediate_ef && data.intermediate_ef !== 0) {
      
    } else {
      let res = await this.netZeroFactorService.getNetZeroFactors(this.year, this.countryCode, sourceName.Use_of_Sold_Products, [netZeroFactors['INTERMEDIATE_EF_' + data.product_type]])
      data.intermediate_ef = res['INTERMEDIATE_EF_' + data.product_type]
    }
    response.e_sc = energy * data.intermediate_ef;
    return response;
  }
}
