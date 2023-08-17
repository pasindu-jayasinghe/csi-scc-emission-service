import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { TransportMode } from "src/emission/enum/transport.enum";

export class PassengerWaterDto {
    mode: TransportMode;
    year: number;
    month: number;
    fuelType: fuelType;
    fuel: FuelBaseDto;
    baseData: BaseDataDto;
}

export class FuelBaseDto {
    fc: number;
    fc_unit: string;
}

// not available yet