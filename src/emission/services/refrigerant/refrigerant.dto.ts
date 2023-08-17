import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";


export class refrigerantDto {

    year:number;
    W_RG:number;
    GWP_RG: String;
    E_RL: number;
    W_RG_Unit: string;
    baseData: BaseDataDto;

}