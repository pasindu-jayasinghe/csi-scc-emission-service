import { ApiProperty } from "@nestjs/swagger";
import { netZeroFactors } from "src/emission/enum/netzerofactors.enum";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class NetZeroFactor extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @Column()
    @ApiProperty()
    code: netZeroFactors;

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

    @ApiProperty()
    @Column()
    emsource: string;

}