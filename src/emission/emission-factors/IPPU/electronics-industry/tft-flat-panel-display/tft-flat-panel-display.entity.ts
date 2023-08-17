import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class TFTFlatPanelDisplay extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    gas: string;

    @ApiProperty()
    @Column({ type: "double",default: 0})
    emissionFactor: number;

    @ApiProperty()
    @Column({ type: "double",default: null, nullable: true})
    conversionFactor: number;

    @ApiProperty()
    @Column({default: null, nullable: true})
    emissionFactor_unit: string;

    @ApiProperty()
    @Column({default: null, nullable: true,length:500})
    remark: string;


}