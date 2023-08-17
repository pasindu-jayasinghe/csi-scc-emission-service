import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";

export class DownstreamLeasedAssetsDto {
    // year:number;
    // fuel:fuelType;
    // consumption: number;
    // consumption_unit: string;
    // fuelType: string;
    // activityType:string;
    // baseData: BaseDataDto;
    year: number;
    month: number;
    method: string;
    emission: number;
    data: leasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData | leasedDataLeasedBuildingsDownstreamLeasedAssetsEmissionSourceData | LessorDataLessorSpecificDownstreamLeasedAssetsEmissionSourceData | RefrigerantAssetSpecificDownstreamLeasedAssetsEmissionSourceData | FuelBaseAssetSpecificDownstreamLeasedAssetsEmissionSourceData;
    baseData: BaseDataDto;  
    groupNumber:string;
}
  
  export class FuelBaseAssetSpecificDownstreamLeasedAssetsEmissionSourceData {
    id: number;
    fuel_type: string;
    fuel_quntity_unit: string;
    fuel_quntity: number;
  }
  
  export class RefrigerantAssetSpecificDownstreamLeasedAssetsEmissionSourceData {
    id: number;
    refrigerant_type: string;
    refrigerant_quntity: number;
    refrigerant_quntity_unit: string;
    process_emission:number;
    process_emission_unit:number;
  
  }
  
  export class LessorDataLessorSpecificDownstreamLeasedAssetsEmissionSourceData {
    id: number;
    user_input_ef:number;
    scp1scp2_emissions_lessor: number;
    scp1scp2_emissions_lessor_unit: string;
    lease_assests_ratio:number
  }

  export class leasedDataLeasedBuildingsDownstreamLeasedAssetsEmissionSourceData {
    id: number;
    user_input_ef:number;
    total_floor_space: number;
    total_floor_space_unit: string;
    building_type: string;
  }
  
  export class LeasedAssetsDownstreamLeasedAssetsEmissionSourceData {
    leased_data: leasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData[];
    
  
  }
  
  export class leasedDataLeasedAssetsDownstreamLeasedAssetsEmissionSourceData {
    user_input_ef:number;
    number_of_assets: number;
    asset_type: string;
    id:number;
  }

