import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Not } from 'typeorm';
import { Fuel } from './fuel.entity';

@Injectable()
export class FuelService extends TypeOrmCrudService<Fuel>{


  constructor(@InjectRepository(Fuel) repo,) { super(repo) };

  async create(createFuelDto: Fuel) {
    return await this.repo.save(createFuelDto);
  }

  async findAllFuel() {
    return await this.repo.find({id: Not(0)})
  }

}
