import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class DisposalElectricalEquipment extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    equipmentType: string;

    @ApiProperty()
    @Column()
    region: string;

    @ApiProperty()
    @Column({ type: "double"})
    fractionOfGas: number;

    @ApiProperty()
    @Column({default: null, nullable: true,length:500})
    remark: string;


}