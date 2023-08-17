import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class Defra extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    code: string;

    @ApiProperty()
    @Column()
    tier: string;

    @ApiProperty()
    @Column({nullable: true, type: "double"})
    reUse: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    openLoop: number;
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    closedLoop: number;
    
   
    
    @ApiProperty()
    @Column({nullable: true, type: "double"})
    combution: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    composting: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    landFill: number;
    
    @ApiProperty()
    @Column({nullable: true,type: "double"})
    AnaeriobicDigestions: number;  

    @ApiProperty()
    @Column({nullable: true,type: "double"})
    PiggeryFeeding: number;  

    @ApiProperty()
    @Column({nullable: true,type: "double"})
    Incineration: number;  

    @ApiProperty()
    @Column()
    year: number;  



}