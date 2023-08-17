import { BaseDataDto } from "src/emission/dto/emission-base-data.dto";
import { fuelType } from "src/emission/enum/fuelType.enum";

export class fuelEnergyRelatedActivitiesDto {
    year:number;
    fuel:fuelType;
    consumption: number;
    consumption_unit: string;
    fuelType: string;
    activityType:string;
    baseData: BaseDataDto;
}

