import { ApiProperty } from "@nestjs/swagger";
import { Fuel } from "../emission-factors/fuel.entity";
import { Expose } from 'class-transformer'

export class ConditionalFuelListResDto{
    @ApiProperty({type: [Fuel]})
    @Expose()
    fuels: Fuel[]
}