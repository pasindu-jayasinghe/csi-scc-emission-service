import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class FreightWaterFac extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ default: null, nullable: true })
    @Column()
    activity: string;


    @ApiProperty()
    @Column()
    type: string;

    
    @ApiProperty()
    @Column()
    size: string;

    @ApiProperty()
    @Column()
    year: string;


    @ApiProperty()
    @Column({type: "double"})
    kgco2e: number;

    @ApiProperty()
    @Column({type: "double"})
    kgco2: number;

    @ApiProperty()
    @Column({type: "double"})
    kgch4: number;


    @ApiProperty()
    @Column({type: "double"})
    kgn20: number;






}