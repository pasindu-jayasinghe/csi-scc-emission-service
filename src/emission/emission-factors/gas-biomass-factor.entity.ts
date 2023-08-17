import { BaseTrackingEntity } from "src/shared/entities/base.tracking.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class GasBiomassFactor extends BaseTrackingEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    countryCode: string;

    @Column()
    year: number;

    @Column()
    value: number;

    @Column()
    ncv: number;

    @Column({ default: null })
    reference: string;

}