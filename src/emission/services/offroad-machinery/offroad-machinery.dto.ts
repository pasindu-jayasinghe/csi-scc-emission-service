import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class OffroadMachineryDto {
    mode: TransportMode
    fuelType: fuelType;
    year: number;
    fuel: FuelBaseDto;
    industry: string;
    baseData: BaseDataDto
}

export class FuelBaseDto {
    fc: number;
    fc_unit: string;
    stroke: string;
}