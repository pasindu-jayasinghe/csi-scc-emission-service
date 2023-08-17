import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";

export class cookingGasDto {

    year:number;
    emissionSource: string; 
    fcn:number;
    gasType: fuelType;
    fcnUnit: string;
    baseData: BaseDataDto;

}