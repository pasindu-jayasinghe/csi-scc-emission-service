import { ApiProperty } from "@nestjs/swagger";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { emissionFactors } from "../enum/emissionFactors.enum";


@Entity()
export class CommonEmissionFactor extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    code: emissionFactors;

    @Column()
    @ApiProperty()
    countryCode: string;

    @Column()
    @ApiProperty()
    year: number;

    @Column({type: "double"})
    @ApiProperty()
    value: number;

    @Column()
    @ApiProperty()
    unit: string;

    @Column({ default: null })
    @ApiProperty()
    reference: string;

}