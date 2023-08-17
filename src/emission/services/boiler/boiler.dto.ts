import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";

export class boilerDto {
    year:number;
    fuel:fuelType;
    consumption: number;
    consumption_unit: string;
    fuelType: string;
    baseData: BaseDataDto;
}