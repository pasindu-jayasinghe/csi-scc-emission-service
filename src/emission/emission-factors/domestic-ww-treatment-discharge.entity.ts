import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class DomesticWWTreatmentDischarge extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ default: null, nullable: true })
    @Column()
    treatmentDischargeType: string;

    @ApiProperty()
    @Column()
    tier: string;

    @ApiProperty()
    @Column({type: "double"})
    MCF: number;

  
}