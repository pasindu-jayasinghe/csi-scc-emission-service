import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class Transport extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    code: string;

    @ApiProperty()
    @Column({type: "double"})
    co2: number;

    @ApiProperty()
    @Column({type: "double"})
    ch4: number;

    @ApiProperty()
    @Column({type: "double"})
    n2o: number;

    @ApiProperty()
    @Column({type: "double"})
    gKm: number;
    

    @ApiProperty()
    @Column({type: "double"})
    kgco2ePKm: number;

    @ApiProperty()
    @Column({type: "double"})
    kgco2eVKm: number;
    
    @ApiProperty()
    @Column()
    assumption: string;


}