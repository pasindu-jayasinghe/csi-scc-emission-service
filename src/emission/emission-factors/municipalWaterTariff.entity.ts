import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class MunicipalWaterTariff extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    category: string;

    @ApiProperty()
    @Column()
    year: string;

    @ApiProperty()
    @Column({type: "double"})
    vat: number;
    
    @ApiProperty()
    @Column({type: "double"})
    usageCharge: number;

    @ApiProperty()
    @Column({nullable: true,type: "double"})
    defaultMonthlyServiceCharge: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_1: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_1: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_1: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_2: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_2: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_2: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_3: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_3: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_3: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_4: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_4: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_4: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_5: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_5: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_5: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_6: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_6: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_6: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_7: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_7: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_7: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_8: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_8: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_8: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_9: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_9: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_9: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_10: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_10: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_10: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_11: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_11: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_11: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_12: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_12: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_12: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_13: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_13: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_13: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_14: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_14: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_14: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_15: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_15: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_15: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_16: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_16: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_16: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_17: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_17: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_17: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_18: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_18: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_18: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_19: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_19: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_19: number;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    lowerLevel_20: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    upperLevel_20: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    monthlyServiceCharge_20: number;




}