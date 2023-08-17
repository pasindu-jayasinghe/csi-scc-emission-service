import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";

export class DownstreamTransportationDto {

  month: number;

  year: number;

  method: string;

  data: FuelParameters | ElectricityParameters | RefrigerentParameters | BackhaulParameters | DistanceBaseMethodDataParameters | SpendBaseMethodDataParameters | SiteSpecificMethodParameters | DTAverageDataMethodDataParameters

  groupNumber: string;

  emission: number;

  baseData: BaseDataDto;
}


export class FuelParameters{
  id: number;
  typeName: string;
  quantity_of_fuel_consumed: number;
  quantity_of_fuel_consumed_unit: string;
  fuelBasefuelType: fuelType;
}

export class ElectricityParameters{
  id: number;
  typeName: string;
  quantity_of_electricity_consumed: number;
  quantity_of_electricity_consumed_unit: string;
}

export class RefrigerentParameters{
  id: number;
  typeName: string;
  quantity_of_refrigerent_leaked: number;
  quantity_of_refrigerent_leaked_unit: string;
  fuelBaseRefrigerantType: string;
}

export class BackhaulParameters{
  id: number;
  typeName: string;
  quantity_of_fuel_consumed_from_backhaul: number;
  quantity_of_fuel_consumed_from_backhaul_unit: string;
  fuelBaseBackhaulFuelType: fuelType
}

export class DistanceBaseMethodDataParameters{
  id: number;
  typeName: string;

  mass_of_goods_purchased: number;
  mass_of_goods_purchased_unit: string;
  distance_travelled_in_transport_leg: number;
  distance_travelled_in_transport_leg_unit: string;
  vehicle_type: string;
}

export class SpendBaseMethodDataParameters{
  id: number;
  typeName: string;

  amount_spent_on_transportation_by_type: number;
  amount_spent_on_transportation_by_type_unit: string;
  shareOfTotalProjectCosts: number;
  shareOfTotalProjectCosts_unit: string;
  eEIO_factor: number;
  eEIO_factor_unit: string;

}

export class SiteSpecificMethodParameters {
  id: number;
  typeName: string;

  volume_of_reporting_companys_purchased_goods: number;
  volume_of_reporting_companys_purchased_goods_unit: string;
  total_volume_of_goods_in_storage_facility: number;
  total_volume_of_goods_in_storage_facility_unit: string;
  fuel_consumed: number
  fuel_consumed_unit: string;
  electricity_consumed: number;
  electricity_consumed_unit: string;
  refrigerant_leakage: number;
  refrigerant_leakage_unit: string;

  refrigerantType: string;
  fuelType: fuelType;
}

export class DTAverageDataMethodDataParameters {
  id: number;
  typeName: string;

  average_number_of_days_stored: number;
  storage_facility_ef: number;
  storage_facility_ef_unit: string;
  volume_of_stored_goods: number;
  volume_of_stored_goods_unit: string;
}