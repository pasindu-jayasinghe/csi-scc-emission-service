import { ApiProperty, ApiResponse } from "@nestjs/swagger";
import { sourceName } from "../enum/sourcename.enum";


// @ApiResponse({})
export class ConditionalFuelListReqDto{
    
    @ApiProperty()
    countryCode: string;

    @ApiProperty()
    es: sourceName;

    @ApiProperty()
    year: string;
}