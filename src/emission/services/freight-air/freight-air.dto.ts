import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { TransportMode } from "src/emission/enum/transport.enum";

export class FreightAirDto {
    mode: TransportMode
    distance: DistanceBaseDto;
    baseData: BaseDataDto;
}

export class DistanceBaseDto {
    distanceUp: number; //one way and two way up, handle distance from port in userservice
    distanceUp_unit: string; 
    weightUp: number; // one way and two way up
    weightUp_unit: string;
    distanceDown: number; 
    distanceDown_unit: string; 
    weightDown: number;
    weightDown_unit: string;
    costUp: number; // one way and two way up
    costDown: number;
    twoWay: boolean;
    trips: number;
}