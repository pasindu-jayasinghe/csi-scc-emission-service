import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class FreightOffroadDto {
    mode: TransportMode
    fuel: FuelBaseDto
    year: number;
    month: number;
    industry: string;
    baseData: BaseDataDto;
}

export class FuelBaseDto {
    fc: number;
    fc_unit: string;
    fuelType: fuelType;
    stroke: string;
}