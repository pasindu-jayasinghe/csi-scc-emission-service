import { UnitConversionReqDto } from "./unit-conversion-req.dto";

export class UnitConversionResDto {
    value: number;
    metaData: UnitConversionReqDto;
}
