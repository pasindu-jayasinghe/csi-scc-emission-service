import { Clasification } from "../enum/clasification.enum";
import { SourceType } from "../enum/sourceType.enum";
import { Tier } from "../enum/tier.enum";

export class BaseDataDto {
    clasification: Clasification;
    tier: Tier;
    sourceType: SourceType;
    industry: string;
    countryCode: string;
}