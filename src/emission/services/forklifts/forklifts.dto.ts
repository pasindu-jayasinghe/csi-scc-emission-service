import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class forkliftsDto {

    year:number;
    fuelType:string;
    consumption:number;
    consumption_unit: string;
    baseData: BaseDataDto;

}