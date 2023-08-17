import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class Incineration extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    wasteType: string;

    @ApiProperty()
    @Column()
    code: string;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    carbonFraction: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    dryMatter: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    fossilCarbonFraction: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    oxidationFactor: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    ef_ch4: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    ef_n2o: number;

    @ApiProperty()
    @Column()
    year: number;  



}