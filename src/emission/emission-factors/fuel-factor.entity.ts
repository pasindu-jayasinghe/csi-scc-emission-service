import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class FuelFactor extends BaseTrackingEntity {

    

 
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    name: string;

    @ApiProperty()
    @Column()
    emsource: string;

    @ApiProperty({ default: null, nullable: true })
    @Column()
    stroke: string;

    @ApiProperty({ default: null, nullable: true })
    @Column()
    unit: string;


    @ApiProperty()
    @Column()
    source: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    industry: string;

    @ApiProperty()
    @Column()
    tier: string;

    @ApiProperty()
    @Column()
    countryCode: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    code: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    year: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    consumptionUnit: string;

 
    @ApiProperty()
    @Column({type: "double"})
    ch4_default: number;

    @ApiProperty()
    @Column({type: "double"})
    ch4__upper: number;

    @ApiProperty()
    @Column({type: "double"})
    ch4_lower: number;

    // efco2: number;

    // @Column()
    // efch4: number;

    // @Column()
    // efn2o: number;

    // @Column()
    // price: number;

    @ApiProperty()
    @Column({type: "double"})
    n20_default: number;

    @ApiProperty()
    @Column({type: "double"})
    n20__upper: number;

    @ApiProperty()
    @Column({type: "double"})
    n20_lower: number;

    @ApiProperty()
    @Column({type: "double"})
    co2_default: number;

    @ApiProperty()
    @Column({type: "double"})
    co2__upper: number;

    @ApiProperty()
    @Column({type: "double"})
    co2_lower: number;

  

    // @Column()
    // ncv: number;

    // @Column()
    // efco2: number;

    // @Column()
    // efch4: number;

    // @Column()
    // efn2o: number;

    // @Column()
    // price: number;

    // @Column()
    // density: number;
    @ApiProperty()
    @Column({ default: null, nullable: true })
    reference: string;
}