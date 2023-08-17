import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class LubricantUse extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    lubricantType: string;

    @ApiProperty()
    @Column({ type: "double",default: 0})
    defaultCarbonContent: number;

    @ApiProperty()
    @Column({ type: "double",default: 0})
    lowerCarbonLimit: number;

    @ApiProperty()
    @Column({ type: "double",default: 0})
    upperCarbonLimit: number;

    @ApiProperty()
    @Column({ type: "double",default: 0})
    defaultFraction: number;

    @ApiProperty()
    @Column({ type: "double",default: 0})
    ODUFactor: number;

    @ApiProperty()
    @Column({default: null, nullable: true,length:500})
    remark: string;


}