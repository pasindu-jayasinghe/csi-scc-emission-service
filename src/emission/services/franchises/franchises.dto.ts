import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class FranchisesDto {

  month: number;

  year: number;

  method: string;

  data: SpecificMethodParameters | NotSubMeteredParameters | SampleGroupParameters | AverageDataMethodFloorSpaceDataParameters | AverageDataMethodNotFloorSpaceDataParameters | AverageDataMethodNotFloorSpaceDataParameters;

  groupNumber: string;

  emission: number;

  baseData: BaseDataDto;
}


export class SpecificMethodParameters {
  id: number;
  typeName: string;

  scopeOneEmission: number;
  scopeOneEmission_unit: string;
  scopeTwoEmission: number;
  scopeTwoEmission_unit: string;
}

export class NotSubMeteredParameters {
  id: number;
  typeName: string;

  franchises_area: number;
  franchises_area_unit: string;

  building_total_area: number;
  building_total_area_unit: string;

  building_occupancy_rate: number;
  building_occupancy_rate_unit: string;

  building_total_energy_use: number
  building_total_energy_use_unit: string
}

export class SampleGroupParameters {
  id: number;
  typeName: string;

  total_e_of_sampled_franchises: number;
  total_number_of_franchises: number;
  number_of_franchises_sampled: number;
}

export class AverageDataMethodFloorSpaceDataParameters {
  id: number;
  typeName: string;

  building_type_total_floor_space: number;
  building_type_total_floor_space_unit: string;
  building_type_average_emission_factor: number;
  building_type_average_emission_factor_unit: string;
  building_type: string;
}

export class AverageDataMethodNotFloorSpaceDataParameters {
  id: number;
  typeName: string;

  number_of_buildings: number;
  average_emissions_of_building: number;
  average_emissions_of_building_unit: string;
}