import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class FuelSpecific extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;


    @ApiProperty()
    @Column()
    code: string;


    @ApiProperty()
    @Column()
    country:string
    
    @ApiProperty()
    @Column()
    year: string;


    @ApiProperty()
    @Column({type: "double"})
    ncv: number;


    @ApiProperty()
    @Column({type: "double"})
    density: number;


    @ApiProperty()
    @Column()
    unit_ncv: string;

    @ApiProperty()
    @Column()
    unit_density: string;


}