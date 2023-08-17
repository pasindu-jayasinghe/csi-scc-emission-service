import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class FreightRailDto{
    mode: TransportMode;
    year: number;
    month: number;
    fuel: FuelBaseDto;
    distance: DistanceBasedDto;
    baseData: BaseDataDto;
}

export class FuelBaseDto{
    fuelType: fuelType;
    fc: number;
    fc_unit: string;
}

export class DistanceBasedDto{
    activity: string
    type: string
    distanceUp: number //one way and two way up
    distanceUp_unit: string
    weightUp: number //one way and two way up
    weightUp_unit: string
    distanceDown: number //one way and two way up
    distanceDown_unit: string
    weightDown: number //one way and two way up
    weightDown_unit: string
    twoWay: boolean;
    trips: number;
}