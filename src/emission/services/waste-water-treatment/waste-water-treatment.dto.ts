import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";

export class wasteWaterTreatmentDto {

    year:number;
    wasteGenerated:number;
    tip:number;
    cod: number;
    anaerobicDeepLagoon : string;
    sludgeRemoved : number;
    recoveredCh4 : number;
    tip_unit: string;
    wasteGenerated_unit: string;
    cod_unit: string;
    sludgeRemoved_unit: string;
    recoveredCh4_unit: string;
    baseData: BaseDataDto;


}