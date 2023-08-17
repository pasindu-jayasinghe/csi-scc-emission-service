import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";
import { unit } from "src/emission/enum/unit.enum";

export class generatorDto{
    year:number;
    month:number
    fc:number;
    unit:string;
    fuelType:fuelType;
    baseData: BaseDataDto;

}