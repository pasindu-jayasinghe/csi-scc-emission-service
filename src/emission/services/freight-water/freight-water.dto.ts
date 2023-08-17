import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class FreightWaterDto {
    mode: TransportMode
    year: number
    fuel: FuelBaseDto
    distance: DistanceBaseDto
    baseData: BaseDataDto
}

export class FuelBaseDto{
    fc: number;
    fc_unit: string;
    fuel_type: fuelType;
}

export class DistanceBaseDto{
    distanceUp: number; //one way and two way up, handle distance from port in userservice
    distanceUp_unit: string; 
    weightUp: number; // one way and two way up
    weightUp_unit: string;
    distanceDown: number; //handle distance from port in userservice
    distanceDown_unit: string; 
    weightDown: number;
    weightDown_unit: string;
    costUp: number; // one way and two way up
    costDown: number;
    twoWay: boolean;
    trips: number;
    activity: string;
    type: string;
    size: string;
}