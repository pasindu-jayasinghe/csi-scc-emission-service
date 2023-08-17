import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";

export class cookingDto {

    year:number;
    w:number;
    fuelType:fuelType;
    w_unit: string;
    baseData: BaseDataDto;

}