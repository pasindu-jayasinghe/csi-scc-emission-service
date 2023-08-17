import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class PassengerRoadDto {
    mode: TransportMode;
    method: string;
    year:number;
    month: number;
    fuel: FuelBaseDto;
    distance: DistanceBaseDto; 
    baseData: BaseDataDto;
}

export class FuelBaseDto {
    businessTravel: FBusinessTravelDto;
    empCommuting: FEmpCommutingDto;
}

export class DistanceBaseDto {
    fe: number;
    fe_unit: string;
    businessTravel: DBusinessTravelDto;
    empCommuting: DEmpCommutingDto;
}

export class FBusinessTravelDto {
    fuelType: fuelType;
    fc:number;
    trips: number;
    fc_unit:string;
}

export class DBusinessTravelDto {
    fuelType: fuelType;
    distance: number; //one way and two way up
    distance_unit: string;
    trips: number;
    cost: number;
    twoWay: boolean;
}

export class FEmpCommutingDto {
    petrolConsumption: number;
    petrolConsumption_unit: string;
    dieselConsumption: number;
    dieselConsumption_unit: string;
    workingDays: number;
}

export class DEmpCommutingDto {
    fuelType: fuelType;
    privateDistance: number;
    privateDistance_unit: string;
    hiredfuelType: fuelType;
    hiredDistance: number;
    hiredDistance_unit: string;
    hiredfe: number;
    hiredfe_unit: string;
    publicDistance: number;
    publicDistance_unit: string;
    publicMode: string;
    workingDays: number;
}