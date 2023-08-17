import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class FuelPrice extends BaseTrackingEntity {

    
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
    @Column()
    month: number;

    @ApiProperty()
    @Column()
    currency: string;

    @ApiProperty()
    @Column({type: "double"})
    price: number;



}