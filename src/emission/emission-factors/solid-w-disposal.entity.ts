import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class SolidWasteDisposal extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    approach: string;

    @ApiProperty()
    @Column()
    climateZone: string;

    @ApiProperty()
    @Column()
    tier: string;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_foodWaste: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_gaeden: number;


    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_paper: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_woodAndStraw: number;


    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_textiles: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_disposableNappies: number;


    @ApiProperty()
    @Column({ default: null, nullable: true })
    doc_sewageSludge: number;


    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_industrailWaste: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    doc_bulkMSW: number;


    //--------methane
    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_foodWaste: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_gaeden: number;


    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_paper: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_woodAndStraw: number;


    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_textiles: number;

    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_disposableNappies: number;


    @ApiProperty()
    @Column({ default: null, nullable: true, type: "double" })
    m_sewageSludge: number;


    @ApiProperty()
    @Column({ default: null, nullable: true , type: "double"})
    m_industrailWaste: number;

    @ApiProperty()
    @Column({ default: null, nullable: true,type: "double"})
    m_bulkMSW: number;










}