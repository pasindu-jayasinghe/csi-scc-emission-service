import { Injectable } from '@nestjs/common';
import { BaseDataDto } from 'src/emission/dto/emission-base-data.dto';
import { emissionCalResDto } from 'src/emission/dto/emission-res.dto';
import { sourceName } from 'src/emission/enum/sourcename.enum';
import { UnitConversionService } from 'src/unit-conversion/unit-conversion.service';

import { GHGProtocolService } from '../GHGProtocol.service';
import { Iso14064Service } from '../iso14064.service';

import { FranchisesEmissionSourceDataMethod } from 'src/emission/enum/FranchisesEmissionSourceDataMethod.enum';
import { AverageDataMethodFloorSpaceDataParameters, AverageDataMethodNotFloorSpaceDataParameters, FranchisesDto, NotSubMeteredParameters, SampleGroupParameters, SpecificMethodParameters } from './franchises.dto';
import { netZeroFactors } from 'src/emission/enum/netzerofactors.enum';
import { NetZeroFactorService } from 'src/emission/emission-factors/net-zero/netzero-factors.service';
import { ParamterUnit } from 'src/emission/enum/parameterUnit.enum';

@Injectable()
export class FranchisesService implements Iso14064Service, GHGProtocolService {
  constructor(
    private netZeroFactorService: NetZeroFactorService,
    private conversionService: UnitConversionService,
  ) { }

  calculationIso14064(data: any) {
    throw new Error('Method not implemented.');
  }

  async calculationGHGProtocol(data: FranchisesDto) {
    let response = new emissionCalResDto();
    switch (data.method) {
      case FranchisesEmissionSourceDataMethod.SPECIFIC_METHOD:
        response = this.calculateSpecificData(data.data as SpecificMethodParameters, data.year, data.month, data.baseData)
        break;
      case FranchisesEmissionSourceDataMethod.NOT_SUB_METERED:
        response = this.calculateSubMertedData(data.data as NotSubMeteredParameters, data.year, data.month, data.baseData)
        break;
      case FranchisesEmissionSourceDataMethod.SAMPLE_GROUPS:
        response = this.calculateSampleGroupsData(data.data as SampleGroupParameters, data.year, data.month, data.baseData)
        break;
      case FranchisesEmissionSourceDataMethod.AVERAGE_DATA_METHOD_FLOOR_SPACE:
        response = await this.calculateAverageDataMethodFlow(data.data as AverageDataMethodFloorSpaceDataParameters, data.year, data.month, data.baseData)
        break;
      case FranchisesEmissionSourceDataMethod.AVERAGE_DATA_METHOD_NOT_FLOOR_SPACE:
        response = await this.calculateAverageDataMethodnotFlow(data.data as AverageDataMethodNotFloorSpaceDataParameters, data.year, data.month, data.baseData)
        break;
    }
    return response;
  }


  calculateSpecificData(data: SpecificMethodParameters, year: number, month: number, baseData: BaseDataDto): emissionCalResDto {
    let response = new emissionCalResDto();
    let total = 0;

    let unit = ParamterUnit.franchises_emission_unit;
    let scopeOneEmission = data.scopeOneEmission;
    let scopeTwoEmission = data.scopeTwoEmission;

    let scopeOneEmission_unit = data.scopeOneEmission_unit;
    let scopeTwoEmission_unit = data.scopeTwoEmission_unit;

    if (scopeOneEmission_unit !== unit) {
      console.log("jjjjj")

      scopeOneEmission = this.conversionService.convertUnit(scopeOneEmission, scopeOneEmission_unit, unit).value;
      console.log("sss",scopeOneEmission)

    }
    if (scopeTwoEmission_unit !== unit) {
      scopeTwoEmission = this.conversionService.convertUnit(scopeTwoEmission, scopeTwoEmission_unit, unit).value;
      console.log("sss",scopeTwoEmission)

    }

    total = scopeOneEmission + scopeTwoEmission;

    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  calculateSubMertedData(data: NotSubMeteredParameters, year: number, month: number, baseData: BaseDataDto): emissionCalResDto {
    let response = new emissionCalResDto();
    let total = 0;
    let areaUnit = ParamterUnit.franchises_area_unit;
    let energyUnit = ParamterUnit.franchises_energy_unit;

    let { franchises_area, building_total_area, building_occupancy_rate, building_total_energy_use } = data
    let { franchises_area_unit, building_total_area_unit, building_total_energy_use_unit } = data

    if (franchises_area_unit !== areaUnit) {
      franchises_area = this.conversionService.convertUnit(franchises_area, franchises_area_unit, areaUnit).value;
    }

    if (building_total_area_unit !== areaUnit) {
      building_total_area = this.conversionService.convertUnit(building_total_area, building_total_area_unit, areaUnit).value;
    }
    if (building_total_energy_use_unit !== energyUnit) {
      building_total_energy_use = this.conversionService.convertUnit(building_total_energy_use, building_total_energy_use_unit, energyUnit).value;
    }
    total = (franchises_area / (building_total_area * building_occupancy_rate)) * building_total_energy_use;

    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  calculateSampleGroupsData(data: SampleGroupParameters, year: number, month: number, baseData: BaseDataDto): emissionCalResDto {
    let response = new emissionCalResDto();
    let total = 0;

    let { total_e_of_sampled_franchises, total_number_of_franchises, number_of_franchises_sampled } = data

    total = (total_e_of_sampled_franchises * total_number_of_franchises) / number_of_franchises_sampled;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateAverageDataMethodFlow(data: AverageDataMethodFloorSpaceDataParameters, year: number, month: number, baseData: BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;

    let areaUnit = ParamterUnit.franchises_area_unit;
    let averageEfUnit = ParamterUnit.franchises_average_ef_unit;

    console.log("data",data)

    let { building_type_total_floor_space, building_type_average_emission_factor } = data;
    let { building_type_total_floor_space_unit, building_type_average_emission_factor_unit } = data;

    if (building_type_total_floor_space_unit !== areaUnit) {
      building_type_total_floor_space = this.conversionService.convertUnit(building_type_total_floor_space, building_type_total_floor_space_unit, areaUnit).value;
    }

    if (!building_type_average_emission_factor) {
      let  BUILDING_TYPE_AVERAGE_EMISSION_FACTOR  = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Franchises, [data.building_type as netZeroFactors ]);
      building_type_average_emission_factor = BUILDING_TYPE_AVERAGE_EMISSION_FACTOR[data.building_type];

    } else {
      building_type_average_emission_factor = this.conversionService.convertUnit(building_type_average_emission_factor, building_type_average_emission_factor_unit, averageEfUnit).value;
    }

    total = building_type_total_floor_space * building_type_average_emission_factor;

    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

  async calculateAverageDataMethodnotFlow(data: AverageDataMethodNotFloorSpaceDataParameters, year: number, month: number, baseData: BaseDataDto): Promise<emissionCalResDto> {
    let response = new emissionCalResDto();
    let total = 0;

    let averagePerBuildingUnit = ParamterUnit.franchises_average_per_building_ef_unit;
    let { number_of_buildings, average_emissions_of_building } = data;
    let { average_emissions_of_building_unit } = data;

    if (!average_emissions_of_building) {
      let { BUILDING_TYPE_AVERAGE_EMISSION_FACTOR_PER_BUILDING } = await this.netZeroFactorService.getNetZeroFactors(year, baseData.countryCode, sourceName.Franchises, [netZeroFactors.BUILDING_TYPE_AVERAGE_EMISSION_FACTOR_PER_BUILDING]);
      average_emissions_of_building = BUILDING_TYPE_AVERAGE_EMISSION_FACTOR_PER_BUILDING;
    } else if (average_emissions_of_building_unit !== averagePerBuildingUnit) {
      average_emissions_of_building = this.conversionService.convertUnit(average_emissions_of_building, average_emissions_of_building_unit, averagePerBuildingUnit).value;
    }

    total = number_of_buildings * average_emissions_of_building;
    response.e_sc_co2 = 0;
    response.e_sc_ch4 = 0;
    response.e_sc_n2o = 0;
    response.e_sc = total/1000;
    return response;
  }

}
