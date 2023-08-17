import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class wasteDisposalDto {

    year:number;
    disposalMethod: String;
    wasteType: string;
    amountDisposed: number;
    amountDisposedUnit: string;
    baseData: BaseDataDto;
    month: number;
}