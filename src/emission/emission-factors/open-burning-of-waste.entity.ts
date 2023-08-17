import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty, ApiBody } from '@nestjs/swagger';


@Entity()
export class OpenBurningOfWaste extends BaseTrackingEntity {

    
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    mswType: string;

    @ApiProperty()
    @Column()
    tier: string;

    @ApiProperty()
    @Column()
    wasteCategory: string;

    @ApiProperty()
    @Column()
    typeOfWate: string;

    @ApiProperty()
    @Column()
    country: string;


    @ApiProperty()
    @Column({ default: null, nullable: true })
    dm: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    cf: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    fcf: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    of: string;

    @ApiProperty()
    @Column({ default: null, nullable: true })
    ef: string;








}