import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Fuel } from './fuel.entity';
import { Transport } from './transport.entity';

@Injectable()
export class TransportService extends TypeOrmCrudService<Transport>{

    constructor(@InjectRepository(Transport) repo,) { super(repo) };

    async create(createFuelDto: Transport) {
        console.log(createFuelDto)
        return await this.repo.save(createFuelDto);
    }


    public async getTransFac(code: string): Promise<any> {
        try {
            const factor = await this.repo.createQueryBuilder("fuelfac")
                .where("fuelfac.code = :code", { code: code })
                .getOne()
            console.log("tranf fac ",code, factor)
            return factor;
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException(err);
        }

    }

    async getLatusFactor(code: any, countryCode: string): Promise<any> {
        const factor = await this.repo.createQueryBuilder("fuelfac")
            .where("fuelfac.code = :code",  //fuelfac.country = :countryCode AND 
                {
                    countryCode: countryCode, code: code
                })
            .orderBy('DESC')
            .limit(1)
            .getMany();
        if (factor && factor.length > 0) {
            return factor[0]
        } else {
            return -1; // TODO: 
        }


    }
}
