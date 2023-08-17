import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class MedicalApplications extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    applicationType: string;

    @ApiProperty()
    @Column({ type: "double"})
    emissionFactor: number;

    @ApiProperty()
    @Column({default: null, nullable: true,length:500})
    remark: string;


}