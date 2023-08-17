import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class PassengerRailDto {
    mode: TransportMode;
    year: number;
    month: number;
    fuelType: fuelType;
    fuel: FuelBaseDto;
    distance: DistanceBaseDto;
    baseData: BaseDataDto;
}

export class FuelBaseDto {
    fc: number;
    fc_unit: string;
}

export class DistanceBaseDto {
    distance: number;
    distance_unit: string;
    fe: number;
    fe_unit: string;
    trips: number;
    twoWay: boolean;
}