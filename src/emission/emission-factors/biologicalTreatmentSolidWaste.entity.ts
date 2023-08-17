import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class BiologicalTreatmentSolidWaste extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ default: null, nullable: true })
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    tier: string;

    @ApiProperty()
    @Column()
    countryCode: string;

    @ApiProperty()
    @Column()
    wasteBasis: string;

    @ApiProperty()
    @Column()
    biologicalTreatmentSystem: string;

    @ApiProperty()
    @Column()
    wasteCategory: string;

    @ApiProperty()
    @Column()
    typeOfWaste: string;

    @ApiProperty()
    @Column()
    ef: number;



}