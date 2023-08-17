import { ApiProperty } from "@nestjs/swagger";
import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class FreightRailFactors extends BaseTrackingEntity{
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column()
    @ApiProperty()
    activity: string;

    @Column()
    @ApiProperty()
    type: string;

    @Column()
    @ApiProperty()
    year: number;

    @Column({type: "double"})
    @ApiProperty()
    kgco2e: number;

    @Column({type: "double"})
    @ApiProperty()
    kgco2: number;

    @Column({type: "double"})
    @ApiProperty()
    kgch4: number;

    @Column({type: "double"})
    @ApiProperty()
    kgn2o: number;



}