import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class FreightRoadDto {
    mode: TransportMode
    year: number;
    month: number;
    fuelType: fuelType;
    fuel: FuelBaseDto
    distance: DistanceBaseDto
    share: number
    baseData: BaseDataDto;
}

export class FuelBaseDto {
    fc: number;
    fc_unit: string;
}

export class DistanceBaseDto {
    distanceUp: number; //one way and two way up
    distanceUp_unit: string; 
    weightUp: number; // one way and two way up
    weightUp_unit: string;
    distanceDown: number; 
    distanceDown_unit: string; 
    weightDown: number;
    weightDown_unit: string;
    costUp: number; // one way and two way up
    costDown: number;
    cargoType: string;
    twoWay: boolean;
    trips: number;
    fe: number;
    fe_unit: string;
}