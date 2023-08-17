import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class TNDLossDto{
    year:number;
    ec:number;
    ec_unit: string;
    baseData: BaseDataDto;
}