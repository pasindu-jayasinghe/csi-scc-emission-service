import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class FireExtinguisherDto {
    year: number;
    fet: string;
    wwpt:number;
    not:number;
    wwpt_unit: string;
    baseData: BaseDataDto;
  }