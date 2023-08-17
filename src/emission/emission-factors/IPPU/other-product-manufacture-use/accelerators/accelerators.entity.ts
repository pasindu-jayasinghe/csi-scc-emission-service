import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class Accelerators extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    processDescription: string;

    @ApiProperty()
    @Column({ type: "double"})
    useFactor: number;

    @ApiProperty()
    @Column({ type: "double"})
    chargeFactor: number;

    @ApiProperty()
    @Column({ type: "double"})
    emissionFactor: number;

    @ApiProperty()
    @Column({default: null, nullable: true,length:500})
    remark: string;


}