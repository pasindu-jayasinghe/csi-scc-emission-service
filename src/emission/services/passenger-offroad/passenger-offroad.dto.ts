import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class PassengerOffroadDto {
    mode: TransportMode;
    year:number;
    month: number;
    fuelType: fuelType;
    fuel: FuelBaseDto;
    distance: DistanceBaseDto;
    industry: string;
    baseData: BaseDataDto;
}

export class FuelBaseDto {
    fc:number;
    fc_unit:string;
    stroke: string;
}

export class DistanceBaseDto {
    distance: number;
    distance_unit: string;
    fe: number;
    fe_unit: string;
    trips: number;
    twoWay: boolean;
}

